const {Sequelize, Op} = require('sequelize')
const sequelize = new Sequelize('eegDatabase', 'username', 'password', {
    host: 'localgost',
    dialect: 'sqlite',
    logging: false,
    storage: 'eegDatabase.sqlite',
});

const Users = require('../models/Users')(sequelize, Sequelize.DataTypes);

module.exports = {
    name: 'leaderboard',
    description: 'See the richest people on the server',
    args: false,
    type: 'currency',

    async execute(message, args, currency) {
        //Get all users with money
        let baseList = await Users.findAll({where: {balance: {[Op.gt]: 0}}, raw: true});
        let sortedList = []
        const originalLength = baseList.length

        //Sort users by richest
        for (i = 0; i < originalLength; i++) {
            let position = 0;
            let greatest = baseList[0];
            
            for (j = 0; j < baseList.length; j++) {
                if (baseList[j].balance > greatest.balance) {
                    console.log(baseList[j]);
                    greatest = baselist[j];
                    position = j;
                }
            }
        
            sortedList.push(baseList[position]);
            baseList.splice(position, 1);

        }

        let leaderboardList = 'Richest Server Members \n\n';

        //Format leaderboard message
        for (i = 0; i < 10; i++) {
            if (i >= sortedList.length) {
                break;
            }

            leaderboardList += `**${i + 1})** \`${(sortedList[i].username.split(('#'))[0])}\`: ${sortedList[i].balance} Eeg Bucks\n`;
        }

        message.channel.send(leaderboardList);

    }
}