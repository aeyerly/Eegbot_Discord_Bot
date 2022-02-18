const {Sequelize, Op} = require('sequelize')
const anonConvos = require('../dbObjects')

module.exports = {
    name: 'anon',
    description: 'DM the bot with this command to send an anonymous message in safe-space. Use !anon convo <severity> to request an anonymous conversation with a trusted helper',
    args: true,
    usage: "<message> or !anon convo <severity>. Severity should be a number 1-10 based on how urgently you need to talk.",
    type: 'Useful',

    async execute(message, args, client, messageDB) {
        let text = "";
        const serverId = '822281673361981443';
        const safeSpaceId = '740335723730960444';
        
        if (message.channel.type === "dm") {
            user = await anonConvos.findOne({where: {user: message.author.tag}})
            if (user) {
                helper = user.helper
                if (!helper) {
                    return message.channel.send('Please wait a bit for someone to reply.')
                }
                helperId = client.users.cache.find(u => u.tag === helper)
                return helperId.send(message)
            }

            helper = await anonConvos.findOne({where: {helper: message.author.tag}})
            if (helper) {
                user = helper.user
                if (!user) {
                    return message.channel.send('Please wait a bit for someone to reply.')
                }
                userId = client.users.cache.find(u => u.tag === user)
                return userId.send(message)
            }

            if (args[0] === 'convo') {
                user = await anonConvos.findOne({where: {user: message.author.tag}})

                if (user) {
                    return message.reply('You have an active conversation going now. Please finish it before requesting another. Use !close to end your active conversation.')
                }

                else {
                    await anonConvos.create({user: message.author.tag})
                    message.channel.send('A request for someone has been made. Please wait for a reply. Use !close at any time to end the conversation.')
                }

                if (args[1] >= 3 && args[1] <= 6) {
                    client.channels.cache.get('801901706220273674').send('@here')
                }

                else if (args[1] >=7 ) {
                    client.channels.cache.get('801901706220273674').send('@everyone')
                }

                user = await anonConvos.findOne({where: {user: message.author.tag}})
                client.channels.cache.get('801901706220273674').send(`A user has requested some help. The severity level is ${args[1]}. Please reply with !anon respond ${user.id} to start the conversation.`)
            }

            else {
                for (i = 0; i < args.length; i++) {
                    text += args[i] + " ";
                }
        
                client.channels.cache.get('801901706220273674').send(text);
    
                message.reply("Message sent!");
    
            }

            
            //Uncomment in case of abuse
            /*
            try {
                const newMessage = await messageDB.create({
                    name: message.author.username,
                    message: text,
                });
            }
            
            catch(e) {
                console.log('Error occurred when using anon command with ' + text + ' message');
                console.log(e);
            }
            */
        }

        else if (message.channel.id === '822281673361981443') {
            if (args[0] === 'respond') {
                convo = await anonConvos.findOne({where: {id: args[1]}})

                if (convo) {
                    convo.update({helper: message.author.tag})
                    message.channel.send('You are now connected. Any messages you dm to the bot will be sent to the other person anonymously and vice versa.')
                    userId = client.users.cache.find(u => u.tag === convo.user)
                    return userId.send("You have been connected. Any messages sent to the bot will now go to the other person.")
                }
            }
        }
    }
}
