const Discord = require('discord.js')

module.exports = {
    name: 'help',
    description: 'Lists commands',
    args: false,
    type: 'Useful',

    execute(message, args) {
        let helpEmbed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('List of Commands');

        const helpfulCommands = [];
        const personalCommands = [];
        const currencyCommands = [];

        const {commands} = message.client;

        function sortCommands (value, key, map) {
            if (value.type === 'Useful') {
                helpfulCommands.push(value);
            }

            else if (value.type === 'personal') {
                personalCommands.push(value);
            }

            else if (value.type === 'currency') {
                currencyCommands.push(value);
            }
        }

        commands.forEach(sortCommands);

        helpEmbed.addField('Personal Commands', 'Special commands for dedicated members');

        personalList = ''
        personalCommands.forEach(command => personalList += `${command.name}, `/*helpEmbed.addField(command.name, '\u200b', true)*/);
        helpEmbed.addField(personalList, '\u200b', true);

        helpEmbed.addField('Useful Commands', 'Commands that may actually serve a purpose');

        helpfulCommands.forEach(command => helpEmbed.addField(command.name, command.description, true));

        helpEmbed.addField('Currency Commands', 'Commands for when you want to make some Eeg Bucks');

        currencyCommands.forEach(command => helpEmbed.addField(command.name, command.description, true));

        //data.push('**Here\'s a list of all commands:**');
        //data.push(commands.map(command => command.name))
        
        //commands.forEach(command => helpEmbed.addField())

        return message.channel.send(helpEmbed);
    }
}