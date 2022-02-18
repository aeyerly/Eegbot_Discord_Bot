const Sequelize = require('sequelize')
const sequelize = new Sequelize('eegDatabase', 'username', 'password', {
    host: 'localgost',
    dialect: 'sqlite',
    logging: false,
    storage: 'eegDatabase.sqlite',
});

const Users = require('../models/Users')(sequelize, Sequelize.DataTypes);

module.exports = {
    name: 'daily',
    args: false,
    description : 'Daily command for 50 Eeg Bucks',
    type: 'currency',

    async execute(message, args) {
        let currentTime = new Date().getTime();
        const user = await Users.findOne({where: {user_id: message.author.id}});

        if (user) {
            //User is able to use daily again
            if (currentTime >= user.lastDailyUsed) {
                balance = user.balance
                Users.update({lastDailyUsed: currentTime + 86400000, balance: balance + 50}, {where: {user_id: message.author.id}});
                message.channel.send('You received 50 Eeg Bucks. Use this command again in 24 hours for another 50.');
            }

            //User is still on cooldown
            else {
                let difference = user.lastDailyUsed - currentTime;
                const hours = Math.floor(difference / 3600000);
                difference -= hours * 3600000;
                const minutes = Math.floor(difference / 60000);
                difference -= minutes * 60000;
                const seconds = Math.floor(difference / 1000);

                message.channel.send(`This command is still on cooldown for another ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`);
            }
        }

        //Creates a new user
        else {
            currentTime += 86400000
            Users.create({user_id: message.author.id, username: message.author.tag, balance: 50, lastDailyUsed: currentTime});
            message.channel.send('You received 50 Eeg Bucks. Use this command again in 24 hours for another 50.')
        }
    }
}