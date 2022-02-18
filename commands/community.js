const Sequelize = require('sequelize')
const sequelize = new Sequelize('eegDatabase', 'username', 'password', {
    host: 'localgost',
    dialect: 'sqlite',
    logging: false,
    storage: 'eegDatabase.sqlite',
});

const CommunityGoal = require("../models/CommunityGoal")(sequelize, Sequelize.DataTypes);
const Users = require("../models/Users")(sequelize, Sequelize.DataTypes);

module.exports = {
    name: 'community',
    description: 'Community-wide donation goal for interesting rewards.',
    args: false,
    usage: "<message>",
    type: 'currency',

    async execute(message, args, currency) {
        let community = await CommunityGoal.findOne({where: {id: 1}});

        if (community) {
            //Basic readout of info on current community reward
            if (!args.length) {
                //Community challenge exists
                if (community.goalCost !== 0) {
                    return message.channel.send(`The current community reward is ${community.goalName}. The cost for this is ${community.goalCost} Eeg Bucks. So far, everyone has raised ${community.goalDonated}.`);
                }

                //No community challenge
                return message.channel.send('There is no active community goal right now. Check back later');
            }

            //User must input integer
            if  (args[0] % 1 === 0) {
                const user = await Users.findOne({where: {user_id: message.author.id}})
                const balance = user.balance;

                //User has enough money for donation
                if (balance >= args[0]) {
                    amount = community.goalDonated + parseInt(args[0]);
                    const contributionAmount = user.communityContribution + parseInt(args[0]);

                    CommunityGoal.update({goalDonated: amount}, {where: {id: 1}});
                    Users.update({balance: balance - args[0], communityContribution: contributionAmount}, {where: {user_id: message.author.id}});
                    return message.channel.send(`Thank you for your contribution! This makes the total ${amount} Eeg Bucks of the ${community.goalCost} Eeg Bucks needed for this reward.`);
                }

                return message.channel.send(`You don't have enough Eeg Bucks to donate that amount.`);
            }
        }

        else {
            return message.channel.send('There is no active community goal right now. Check back later.');
        }

        //Command for me to set new rewards
        if(args[0] === 'set' && message.author.tag === 'MrSeppukun#7238') {
            if (args.length < 3) {
                return message.channel.send('Not enough args. Usage is !community set <goal> <reward>');
            }

            let reward = ''

            for (i = 2; i < args.length - 1; i++) {
                reward += args[i] + ' ';
            }

            reward += args[args.length - 1];

            if (community) {
                await CommunityGoal.update({goalName: reward, goalCost: args[1], goalDonated: 0}, {where: {id: 1}});
                return message.channel.send('New community challenge created');
            }

            
        }

        return message.channel.send('Something went wrong');
    }
}