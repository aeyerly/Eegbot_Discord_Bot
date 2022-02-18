const Sequelize = require('sequelize')
const sequelize = new Sequelize('eegDatabase', 'username', 'password', {
    host: 'localgost',
    dialect: 'sqlite',
    logging: false,
    storage: 'eegDatabase.sqlite',
});

const Users = require("../models/Users")(sequelize, Sequelize.DataTypes);

module.exports = {
    name: 'give',
    description: 'Transfer eeg bucks to someone',
    args: true,
    type: 'Currency',
    usage: '<@user> <amount>',

    async execute(message, args, currency) {
        const transferAmount = args[1];
        const temp = args[0].slice(3);
        let recipient = ''

        //Get recipients id
        for (i = 0; i < temp.length; i ++) {
            if (temp[i] !== '>') {
                recipient += temp[i]; 
            }
        }

        user = await Users.findOne({where: {user_id: message.author.id}})

        //User does not exist
        if (!user) {
            return message.channel.send('You have no money.')
        }

        //User is recipient
        if (message.author.id === recipient) {
            return message.channel.send('You can\'t send money to yourself.');
        }

        //User is too poor
        if(user.balance < transferAmount) {
            return message.channel.send('You don\'t have enough money to send that amount')
        }

        target = await Users.findOne({where: {user_id: recipient}})

        //Recipient does not exist
        if(!target) {
            return message.channel.send(`This user doesn't have an account yet. Try again later`);
        }

        //Recipient is at their receive limit
        if (target.received + parseInt(transferAmount) > target.receiveLimit) {
            return message.channel.send(`This would put the recipient over their gift limit. They are currently at ${target.received}/${target.receiveLimit}. Limits reset everyday at midnight.`)
        }

        //Transfer funds
        Users.update({balance: user.balance - parseInt(args[1])}, {where: {user_id: message.author.id}});
        Users.update({balance: target.balance + parseInt(args[1]), received: target.received + parseInt(args[1])}, {where: {user_id: recipient}});
        return message.channel.send(`You successfully transferred ${args[1]} Eeg Bucks`)

        
    }
}