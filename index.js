/***********
*Bot developed by MrSeppukun
**********/

//Imports
const Discord = require('discord.js');
const fs = require('fs');
const Console = require('console');
const {Sequelize, Op} = require('sequelize');
//TODO add database imports here

const cron = require('cron');
const anon = require('./commands/anon');

//Initialization
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//Startup
client.once('ready', async() => {
    console.log('Bot Online.')
    //messageDB.sync();
    //anonConvos.sync();
    //TODO DB Stuff 
});

//Member Join
client.options("guildMemberAdd", (member) => {
    console.log("User Joined Server.");

    try {
        member.send(exampleEmbed)
            .then(sentEmbed => {sentEmbed.react('👍')})
        
        const filter = (reaction, user) => {
            return reaction.emoji.name === '👍' && user.id != sentEmbed.author.id;
        }

        sentEmded.awaitReactions(filter, {max: 1})
            .then(collected => {
                member.send('Welcome to the server!');
                var role = member.guild.roles.cache.find(role => role.name === 'Followers');
                member.roles.add(role);
            }).catch(console.error);
    } catch {
        console.error;
    }
});

//Message Sent
client.on('message', async message => {

    //Anon Conversations
    //TODO implement anon conversations
    
})
