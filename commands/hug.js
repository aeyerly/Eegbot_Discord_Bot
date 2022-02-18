module.exports = {
    name: 'hug',
    description: 'Hug someone',
    args: true,
    usage: '<user>',
    type: 'Useful',

    execute(message,args) {
        message.channel.send(`${args[0]} you have been hugged by ${message.author}!`);
    }
}