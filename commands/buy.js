const Sequelize = require('sequelize')
const sequelize = new Sequelize('eegDatabase', 'username', 'password', {
    host: 'localgost',
    dialect: 'sqlite',
    logging: false,
    storage: 'eegDatabase.sqlite',
});

const ItemShop = require('../models/ItemShop')(sequelize, Sequelize.DataTypes);
const Users = require('../models/Users')(sequelize, Sequelize.DataTypes);
const Inventory = require('../models/Inventory')(sequelize, Sequelize.DataTypes);

module.exports = {
    name: 'buy',
    args: true,
    description : 'Buy an item',
    usage: '<itemName> <amount>',
    type: 'currency',

    async execute(message, args, currency) {
        //Find item
        const item = await ItemShop.findOne({where: {itemId: args[0]}});
        if (!item) return message.channel.send('That item doesn\'t exist.');

        let totalCost = 0;
        let amount = 1;

        if (args[1]) {
            amount = parseInt(args[1]);
        }

        //Determine cost of transaction
        totalCost += amount * item.cost;

        //Make sure user actually exists in DB, create one otherwise
        const user = await Users.findOne({where: {user_id: message.author.id}});

        if (!user) {
            await Users.upsert({user_id: message.author.id, username: message.author.tag, balance: 0});
            user = await Users.findOne({where: {user_id: message.author.id}});
        }

        balance = user.balance;

        //Make sure user has enough for transaction
        if (totalCost > balance) {
            return message.channel.send(`You don't have enough money to make this purchase. You need ${totalCost - balance} more Eeg Bucks`);
        }

        //Update user's balance
        const newBalance = balance - totalCost;
        await Users.upsert({user_id: message.author.id, balance: newBalance});
        ItemShop.update({todayBuys: item.todayBuys + amount}, {where: {itemId: args[0]}});

        message.channel.send(`You bought: ${amount} ${item.itemName}`);

        //Update user's inventory
        const userItem = await Inventory.findOne({
            where: {user_id: message.author.id, item_id: item.itemId},
        });
    
        if (userItem) {
            userItem.amount += amount;
            return userItem.save();
        }
    

        return Inventory.create({user_id: message.author.id, item_id: item.itemId, amount: amount});
    }
}