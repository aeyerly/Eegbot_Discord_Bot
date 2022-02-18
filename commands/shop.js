const Discord = require('discord.js');
const Sequelize = require('sequelize')
const sequelize = new Sequelize('eegDatabase', 'username', 'password', {
    host: 'localgost',
    dialect: 'sqlite',
    logging: false,
    storage: 'eegDatabase.sqlite',
});

const ItemShop = require('../models/ItemShop')(sequelize, Sequelize.DataTypes);

module.exports = {
    name: 'shop',
    args: false,
    description : 'Displays everything in the shop',
    type: 'currency',

    async execute(message, args, CurrencyShop) {

        let shopEmbed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Eeg\'s Bazaar');

        const shopItems = await ItemShop.findAll();

        shopItems.forEach(item => {shopEmbed.addField(`**${item.itemName}** (${item.itemId})`, `Buy Price: \`E$ ${item.cost}\` \nSell Price: \`E$ ${item.sellPrice}\` `, true); shopEmbed.addField('\u200B', '\u200b',true)})


        message.channel.send(shopEmbed);
        return message.channel.send('Use !buy <id> <amount> or !sell <id> <amount>');
        
    }
}