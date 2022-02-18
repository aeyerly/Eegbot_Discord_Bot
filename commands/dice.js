const Sequelize = require('sequelize')
const sequelize = new Sequelize('eegDatabase', 'username', 'password', {
    host: 'localgost',
    dialect: 'sqlite',
    logging: false,
    storage: 'eegDatabase.sqlite',
});

const Users = require("../models/Users")(sequelize, Sequelize.DataTypes);

module.exports = {
    name: 'dice',
    description: 'Roll a dice. If it lands on what you guessed, triple your bet.',
    args: true,
    usage: "<wager> <guess>",
    type: 'currency',

    async execute(message, args, currency) {

        let wager = args[0];
        const user = await Users.findOne({where: {user_id: message.author.id}});

        if (wager > user.balance) {
            return message.reply('You\'re betting more than you have!');
        }

        let guess = args[1];

        if (guess > 6) {
            return message.reply('You can\'t bet on a number greater than ');
        }

        let roll = (Math.floor(Math.random() * Math.floor(6))) + 1;

        message.channel.send(`Rolled a ${roll}`);

        if (parseInt(guess) === roll) {
            Users.update({balance: user.balance + (parseInt(args[0]) * 3)}, {where: {user_id: message.author.id}});
            message.channel.send('Congratulations. You won.');
        }

        else {
            Users.update({balance: user.balance - parseInt(args[0])}, {where: {user_id: message.author.id}});
        }
    }
}