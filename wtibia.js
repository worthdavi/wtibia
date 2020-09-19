console.log("Connecting...")

const Discord = require('discord.js'),
    client = new Discord.Client({
        autoReconnect: true,
        messageCacheMaxSize: 2024,
        fetchAllMembers: true,
        disabledEvents: ['typingStart', 'typingStop', 'guildMemberSpeaking'],
        messageCacheLifetime: 1680,
        disableEveryone: true,
        messageSweepInterval: 1680
    });
    config = require("./config.json"),
    token = config.token;

let prefix = config.prefix,
    dono = config.dono;

client.login(token)

client.on("ready", () => { 
    client.user.setPresence({ 
        activity: {
            name: config.client.presence,
            type: 'PLAYING',
        },
        status: 'online',
    });
    console.log("Connected.");
})

client.on("message", (message) => {

    if (message.channel.type == "dm") return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    
    let command = message.content.split(" ")[0];
    command = command.slice(prefix.length);

    let args = message.content.split(" ").slice(1);
    
    try {
        let commandFile = require(`./src/${command}.js`);
        commandFile.run({Discord, client, message, args});
    } catch (err) {

        if (err.code == "MODULE_NOT_FOUND") return;
        console.error(err);
    }
})