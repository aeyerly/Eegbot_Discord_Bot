// Bot Developed by Alex Eyerly
// Eegbot Discord Bot

//Imports
const Discord = require('discord.js');
const fs = require('fs');
const {Sequelize, Op} = require('sequelize');
const currency = new Discord.Collection();
const {Users, ItemShop, Inventory, CommunityGoal, AnonConversations, Lottery} = require('./dbObjects');
const cron = require('cron');
const {prefix, token} = require('./config.json');

//Initialization
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

Inventory.belongsTo(ItemShop, {foreignKey: 'item_id', as: 'item'});

//Timed Events
async function midnightJob() {
    const items = await ItemShop.findAll();
    newPopularItem = Math.floor(Math.random() * 9) + 1;

    Users.update({received: 0}, {where: {received: {[Op.gt]: 0}}})

    items.forEach(async item => {
        let mToday = item.todayBuys - item.todaySells;
        let mYesterday = item.yesterdayBuys - item.yesterdaySells;

        mPurchases = (mToday - mYesterday) / 200;
        if (item.itemId === newPopularItem) {
            mPurchases -= .2;
        }

        if (item.bonusItem === 1) {
            mPurchases += .2;
        }

        if (mPurchases >= 0) {
            if (mPurchases > .2 && item.bonusItem != 1) {
                mpurchases = .2;
            }

            newBuyPrice = Math.floor(item.cost * (1 + mPurchases));
            newSellPrice = Math.floor(newBuyPrice / 2);
        }

        else {
            if (mPurchases < -.2 && item.itemId != newPopularItem) {
                mPurchases = .2;
            } 

            newBuyPrice = Math.floor(item.cost * (1 - mPurchases));
            newSellPrice = Math.floor(newBuyPrice / 2);
        }

        if (newBuyPrice < 10) {
            newBuyPrice = 10;
            newSellPrice = 5;
        }
        
        ItemShop.update({yesterdayBuys: item.todayBuys}, {where: {itemName: item.itemName}});
        ItemShop.update({yesterdaySells: item.todaySells}, {where: {itemName: item.itemName}});
        ItemShop.update({todayBuys: 0}, {where: {itemName: item.itemName}});
        ItemShop.update({todaySells: 0}, {where: {itemName: item.itemName}});
        ItemShop.update({cost: newBuyPrice}, {where: {itemName: item.itemName}});
        ItemShop.update({sellPrice: newSellPrice}, {where: {itemName: item.itemName}});
    });
    const item = await ItemShop.findOne({where: {bonusItem: 1}});
    ItemShop.update({bonusItem: 0, cost: Math.floor(item.cost * 5/6), sellPrice: Math.floor(item.sellPrice * 5/6)}, {where: {bonusItem: 1}});
    ItemShop.update({bonusItem: 1}, {where: {itemId: newPopularItem}})

    popularName = await ItemShop.findOne({where: {itemId: newPopularItem}});
}

//Constantly keep database synced
async function dbSync() {
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));
    const community = await CommunityGoal.findOne({where: {id: 1}});

    if (community) {
        if (community.goalDonated >= community.goalCost && community.goalCost != 0) {
            CommunityGoal.update({goalName: '', goalCost: 0, goalDonated: 0}, {where: {id: 1}});
            client.users.cache.find(user => user.id === '361271569496014852').send('The community goal has been met!');
            
            let communityLeaderboard = '';
            const contributors = await Users.findAll({where: {communityContribution: {[Op.gt]: 0}}});
            let unorderedList = [];
            contributors.forEach(user => unorderedList.push(user));
            let originalLength = unorderedList.length;
            
            for (i = 0; i < originalLength; i++) {
                let greatest = unorderedList[0];
                let position = 0;
                
                for (j = 0; j < unorderedList.length; j++) {
                    if (unorderedList[j].communityContribution > greatest.communityContribution) {
                        greatest = unorderedList[j];
                        position = j;
                    }
                    
                }
                communityLeaderboard += `${i+1}. ${greatest.username}: $${greatest.communityContribution}\n`;
                unorderedList.splice(position);
            }

            Users.update({communityContribution: 0}, {where: {communityContribution: {[Op.gt]: 0}}});
            
            client.channels.cache.get('757679230703108170').send('The community goal has been met! Thank you to everyone who participated!\n\nContribution Leaderboard:\n' + communityLeaderboard);

        }
    }
}

let midnightUpdate = new cron.CronJob('0 * * * * *', midnightJob);
let constantUpdate = new cron.CronJob('* * * * * *', dbSync);

//Database Initialization
const sequelize = new Sequelize('eegDatabase', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'eegDatabase.sqlite',
});

//Formatting Database
const messageDB = sequelize.define('Messages', {
    name: { 
        type: Sequelize.STRING
    },
    message: Sequelize.TEXT,
});

//Embeds

//Rules Embed
const rulesEmbed = new Discord.MessageEmbed()
    .setColor('#ff0000')
    .setTitle('The Rules')
    .setDescription('Please read the rules to gain access to the discord')
    .addFields(
        {name: 'Rule #1', value: 'Be Respectful and Considerate of Your Peers'},
        {name: 'Rule #2', value: 'Refrain From Vulgar Comments'},
        {name: 'Rule #3', value: 'Don\'t spam'},
        {name: 'Rule #4', value: 'No Inappropriate Links, Images, or Videos'},
        {name: 'Rule #5', value: 'Place Content in the Appropriate Channel'},
        {name: 'Rule #6', value: 'Have Fun'},
    )
    .setFooter('Please react to this message to state that you agree to our rules')

//Setting Commands
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//Add function to change currency amount of user
Reflect.defineProperty(currency, 'add', {
    value: async function add(user_id, amount) {
        const user = currency.get(user_id);
        if (user) {
            user.balance += Number(amount);
            return user.save();
        }

        const newUser = await Users.create({user_id: id, balance: amount});
        currency.set(id, newUser);
        return newUser;
    },
});

//Getter for a user's balance
Reflect.defineProperty(currency, 'getBalance', {
    value: function getBalance(id) {
        const user = currency.get(id);
        return user ? user.balance : 0;
    },
});


//Startup
client.once('ready', async() => {
    console.log('Bot Online.')
    
    messageDB.sync();
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));
    
    midnightUpdate.start();
    constantUpdate.start();

});

//Member Join
client.on("guildMemberAdd", (member) => {
    console.log("User Joined Server.");

    try {
        member.send(exampleEmbed)
            .then(sentEmbed => {sentEmbed.react('👍')})
        
        const filter = (reaction, user) => {
            return reaction.emoji.name === '👍' && user.id != sentEmbed.author.id;
        }

        sentEmded.awaitReactions(filter, {max: 1})
            .then(collected => {
                member.send('Welcome to the server!');
                var role = member.guild.roles.cache.find(role => role.name === 'Followers');
                member.roles.add(role);
            }).catch(console.error);
    } catch {
        console.error;
    }
});

//Message Sent
client.on('message', async message => {

    //Anon conversations
    if (message.channel.type === "dm") {
        user = await AnonConversations.findOne({where: {userId: message.author.id}});
        if (user) {
            if (message.content === "!close") {
                user.helperId.send("The other user has ended the conversation.");
                AnonConversations.destroy({where: {userId: message.author.id}});

                return message.channel.send('You closed your conversation. You can always use this command if you need help, so please make sure to use it when you need it.');
            }

            helper = user.helperId;
            if (!helper) {
                return message.channel.send('Please wait a bit for someone to reply.');
            }

            else {
                return helperId.send(message);
            }
        }

        helper = await AnonConversations.findOne({where: {helperId: message.author.id}});
        if(helper) {
            if (message.content === "!close") {
                helper.userId.send("The other user has ended the conversation.");
                AnonConversations.destroy({where: {helperId: message.author.id}});

                return message.channel.send('The conversation has been ended.');
            }
        }
    }

    if (message.content.startsWith(prefix)) {
        //Formatting command
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!client.commands.has(commandName)) return;

        const command = client.commands.get(commandName);
        
        //User did not provide arguments when command requires arguments
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments ${message.author}! `;

            if (command.usage) {
                reply += `The correct usage for this command is \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

        try {
            //Currency based commands
            if (command.type  === 'currency') {
                command.execute(message, args, currency, currency.add, currency.getBalance);
            }

            //Non-currency commands
            else {
                command.execute(message, args);
            }
        } catch (error) {
            console.error(error);
            message.reply('Something went wrong while executing that command');
        }
    } 
});



client.login(token);
