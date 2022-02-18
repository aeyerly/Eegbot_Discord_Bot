const Sequelize = require('sequelize')
const sequelize = new Sequelize('eegDatabase', 'username', 'password', {
    host: 'localgost',
    dialect: 'sqlite',
    logging: false,
    storage: 'eegDatabase.sqlite',
});

const Users = require('../models/Users')(sequelize, Sequelize.DataTypes);

module.exports = {
    name: 'bal',
    description: 'Get your current balance',
    args: false,
    type: 'currency',

    async execute(message, args, currency) {
        const target = message.mentions.users.first() || message.author;
        user = await Users.findOne({where: {user_id: target.id}});

        if (user) {
            return message.channel.send(`${target.username} has ${user.balance} Eeg Bucks`);
        }

        return message.channel.send('An error occurred.');
        
    }
}