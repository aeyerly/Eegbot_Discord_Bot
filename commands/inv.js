const Discord = require('discord.js');
const Sequelize = require('sequelize')
const sequelize = new Sequelize('eegDatabase', 'username', 'password', {
    host: 'localgost',
    dialect: 'sqlite',
    logging: false,
    storage: 'eegDatabase.sqlite',
});


const Inventory = require('../models/Inventory')(sequelize, Sequelize.DataTypes);
const Users = require('../models/Users')(sequelize, Sequelize.DataTypes);
const ItemShop = require(`../models/ItemShop`)(sequelize, Sequelize.DataTypes);

module.exports = {
    name: 'inv',
    args: false,
    description : 'Displays everything in your inventory',
    type: 'currency',

    async execute(message, args) {
        //Associate user inventory with the item shop
        Inventory.belongsTo(ItemShop, {foreignKey: 'item_id', as: 'item'});

        //Embed to format
        let inventoryEmbed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Your Stuff');

        const user = await Users.findOne({where: {user_id: message.author.id}});
        

        if (user) {
            //Get all items a user owns
            const items = await Inventory.findAll({where: {user_id: message.author.id}, include: ['item']})

            //User has nothing
            if (!items.length) return message.channel.send(`You've got nothing`);

            //Add items to embed
            items.forEach(item => inventoryEmbed.addField(item.item.itemName, `Quantity: ${item.amount}`));
            return message.channel.send(inventoryEmbed);
        }

        return message.channel.send(`You've got nothing.`)
    }
}