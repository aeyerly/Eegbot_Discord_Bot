const Sequelize = require('sequelize')
const sequelize = new Sequelize('eegDatabase', 'username', 'password', {
    host: 'localgost',
    dialect: 'sqlite',
    logging: false,
    storage: 'eegDatabase.sqlite',
});

const Inventory = require("../models/Inventory")(sequelize, Sequelize.DataTypes);
const ItemShop = require("../models/ItemShop")(sequelize, Sequelize.DataTypes);;
const Users = require("../models/Users")(sequelize, Sequelize.DataTypes);;

module.exports = {
    name: 'sell',
    description: 'Sell some of your items for Eeg bucks',
    args: true,
    type: 'currency',

    async execute(message, args, currency) {
        //Get item
        const item = await ItemShop.findOne({where: {itemId: args[0]}});

        //Item does not exist
        if (!item) return message.channel.send(`This item doesn't exist`);

        let totalProfit = 0;
        let amount = 1;

        if (args[1]) {
            amount = parseInt(args[1]);
        }

        totalProfit += amount * item.sellPrice;

        //Find if user has this item in their inventory
        const userItem = await Inventory.findOne({where: {user_id: message.author.id}, item_id: args[0]});

        if (!userItem || userItem.amount < amount) {
            return message.channel.send(`You don't have enough of this item to make this transaction`);
        }

        const user = await Users.findOne({where: {user_id: message.author.id}});

        //Update database
        Users.update({balance: user.balance + totalProfit}, {where: {user_id: message.author.id}});
        Inventory.update({amount: userItem.amount - amount}, {where: {user_id: message.author.id, item_id: args[0]}});
        ItemShop.update({todaySells: item.todaySells + amount}, {where: {itemId: args[0]}});

        return message.channel.send(`You sold ${amount} ${item.itemName} for ${totalProfit} Eeg Bucks`);
    }
}