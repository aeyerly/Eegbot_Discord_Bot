const Sequelize = require('sequelize')
const sequelize = new Sequelize('eegDatabase', 'username', 'password', {
    host: 'localgost',
    dialect: 'sqlite',
    logging: false,
    storage: 'eegDatabase.sqlite',
});

const Users = require("../models/Users")(sequelize, Sequelize.DataTypes);

module.exports = {
    name: 'job',
    args: false,
    description: 'Use this command with collect or promotion to get money or increase salary. Jobs can give hourly Eeg Bucks up to 1 week stored.',
    type: 'currency',

    async execute(message, args) {
        //Current time in seconds since like 1970
        const currentTime = new Date().getTime();

        //Just display info on current salary
        if (!args.length) {
            const user = await Users.findOne({where: {user_id: message.author.id}});

            if (user.jobLevel > 0) {
                return message.channel.send(`Your current job makes you ${incomeFormula(user.jobLevel)} per hour.`);
            }

            message.channel.send(`You didn't have a job so I gave you one that starts at 1 Eeg Buck per hour`);
            if (user) {
                return Users.update({jobLevel: 1}, {where: {user_id: message.author.id}});
            }

            return Users.create({user_id: message.author.id, username: message.author.tag, balance: 0, jobLevel: 1});
        }

        //Collecting wages
        else if (args[0] === 'collect') {  
            const user = await Users.findOne({where: {user_id: message.author.id}});
            const difference = currentTime - user.lastJobCollect;

            let numHours = Math.floor(difference / 3600000);
            
            //Max number of hours
            if (numHours > 168) {
                numHours = 168;
            }

            //Less than one hour worked
            if (numHours === 0) {
                return message.channel.send(`You haven't worked for a full hour yet.`);
            }

            //Adding money
            Users.update({balance: user.balance + (numHours * incomeFormula(user.jobLevel)), lastJobCollect: currentTime}, {where: {user_id: message.author.id}});
            return message.channel.send(`You worked ${numHours} hours and earned ${numHours * incomeFormula(user.jobLevel)} Eeg Bucks`);
        }

        //Promoting for more income
        else if (args[0] === 'promotion') {
            const user = await Users.findOne({where: {user_id: message.author.id}});
            
            //Get information on next promotion
            if (!args[1]) {
                
                //User exists
                if (user && user.jobLevel > 0) {
                    let promoIncome = incomeFormula(user.jobLevel);
                    let promoCost = costFormula(user.jobLevel);

                    return message.channel.send(`A promotion would get you an income of ${promoIncome} Eeg Bucks per hour, but it will cost you ${promoCost} Eeg Bucks first. If you want the promotion, use !job promotion confirm.`);
                }

                return message.channel.send('You need a job first in order to get a promotion. Use !job to get one');
            }

            //Actually promoting
            else if (args[1] === 'confirm') {
                if (user) {
                    let promoIncome = incomeFormula(user.jobLevel);
                    let promoCost = costFormula(user.jobLevel);

                    //User has enough money for promotion
                    if (user.balance >= promoCost) {
                        Users.update({balance: user.balance - promoCost, jobLevel: user.jobLevel + 1, lastJobCollect: currentTime}, {where: {user_id: message.author.id}});

                        return message.channel.send(`Congratulations, you now make ${promoIncome} Eeg Bucks per hour`);
                    }

                    return message.channel.send(`You can't afford this promotion. It requires ${promoCost}`);
                }

                return message.channel.send('You need a job to get a promotion. Use !job to get one.');
            }
        }

        //Formula to calculate income at each level
        function incomeFormula(level) {
            return Math.ceil(Math.exp(.31 * level) + .63)
        }

        //Formula to calculate cost to promote to next level
        function costFormula(level) {
            return Math.ceil((Math.exp(.4 * level) * 69));
        }
    }

    
}