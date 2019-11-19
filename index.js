const Discord = require("discord.js");
const client = new Discord.Client();
const chalk = require('chalk');
const Canvas = require('canvas');
const {
    prefix,
    botToken,
    admins,
    joinRole,
    ownerID,
    guildID,
    memberCountChannelID,
    channelCountChannelID,
    newMemberDMMessage,
    addMemberToRole1Command,
    role1Permission,
    role1ID,
    addMemberToRole2Command,
    role2Permission,
    role2ID,
    welcomeMessageChannelName
} = require('./config.json');

client.on("ready", () => {
    console.log(chalk.bgGreenBright("INFO:") + (` Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`));
    client.user.setActivity(`Online`);
});

//image welcome
const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;

    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);

    return ctx.font;
};

client.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.find(ch => ch.name === name);
    if (!channel) return console.log(chalk.bgRed('ERR') + (`${welcomeMessageChannelID} channel was not found`));

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage('./wallpaper.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

    ctx.font = applyText(canvas, `${member.displayName}!`);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
        format: 'jpg'
    }));
    ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

    channel.send(`Welcome to the server, ${member}!`, attachment);
});

client.on('message', message => {
    if (message.content === '!join') {
        client.emit('guildMemberAdd', message.member);
    }
});


//server status guildmembers
client.on('ready', () => {
    let guild = client.guilds.get(guildID);
    let channel = guild.channels.get(memberCountChannelID)
    setInterval(function () {
        channel.setName(`Member Count: ${guild.memberCount}`)
    }, 60000)

})


//server status channels
client.on('ready', () => {
    let guild = client.guilds.get(guildID);
    let channel = guild.channels.get(channelCountChannelID)
    setInterval(function () {
        channel.setName(`Total Channels: ${client.channels.size}`)
    }, 60000)

})

client.on("message", (message) => {
    if (member.user.bot) return;
    if (message.member.hasPermission('ADMINISTRATOR')) return;
    if (message.content.includes('discord.gg')) {
        message.delete()
        message.reply(`${member} you cannot post invites`);
        console.log(chalk.bgYellow('INFO:') + (`invite sent by ${member} was successfully deleted`));
    }
})

//dm new members and log in console
client.on('guildMemberAdd', (member) => {
    if (member.user.bot) return;
    member.send(newMemberDMMessage);
    console.log(chalk.bgBlue(`INFO:`) + (`New member ${member} has been dm'd`));
    console.info(`\x1b[37m\x1b[44mINFO\x1b[0m: Bot messaged new user!`);
});


client.on("message", async message => {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    //say
    if (command === "say") {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            const sayMessage = args.join(" ");
            message.delete().catch(O_o => {});
            message.channel.send(sayMessage);
        } else {
            return message.reply(`${member} you do not have permission to use this`);
        }
    }

    if (command === "help") {
        const embed = new Discord.RichEmbed()
            .setTimestamp()
            .setTitle("List of Bot Commands")
            .addField("-help", "Gives a list of commands")
            .addField(`${prefix}` + `${addMemberToRole1Command}`, `${role1Permission} ONLY`)
            .addField(`${prefix}` + `${addMemberToRole2Command}`, `${role2Permission} ONLY`)
            .addField("-clear", "ADMINISTRATOR ACCESS ONLY")
            .addField("-kick", "ADMINISTRATOR ACCESS ONLY")
            .addField("-ban", "ADMINISTRATOR ACCESS ONLY")
            .addField("-say", "ADMINISTRATOR ACCESS ONLY!");
        message.channel.send({
            embed
        })
    }

    //clear
    if (command === "clear") {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            const deleteCount = parseInt(args[0], 10);
            if (!deleteCount || deleteCount < 2 || deleteCount > 900) //set deletecount
                return message.reply("Please provide a number between 2 and 900 for the number of messages to delete");
            const fetched = await message.channel.fetchMessages({
                limit: deleteCount
            });
            message.channel.bulkDelete(fetched)
                .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
        } else {
            return message.reply(`${member} you do not have permission to use this`);
        }
    }

    //add member to role1
    if (command === addMemberToRole1Command) {
        if (message.member.hasPermission(role1Permission)) {
            let role = message.guild.roles.get(role1ID);
            let member = message.mentions.members.first();
            member.addRole(role).catch(console.error);
            console.log(chalk.bgBlue('INFO')(` ${member} has been succesfully assigned the ${role} role`))
        } else {
            return message.reply(`${member} you do not have permission to use this`);
        }
    }

    //add member to role2
    if (command === addMemberToRole2Command) {
        if (message.member.hasPermission(role2Permission)) {
            let role = message.guild.roles.get(role2ID);
            let member = message.mentions.members.first();
            member.addRole(role).catch(console.error);
            console.log(chalk.bgBlue('INFO')(` ${member} has been succesfully assigned the ${role} role`))
        } else {
            return message.reply(`${member} you do not have permission to use this`);
        }
    }


    //kick
    if (command === "kick") {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            let member = message.mentions.members.first() || message.guild.members.get(args[0]);
            if (!member)
                return message.reply("Please mention a valid member of this server");
            if (!member.kickable)
                return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
            let reason = args.slice(1).join(' ');
            if (!reason) reason = "No reason provided";
            await member.kick(reason)
                .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
            console.log(chalk.bgYellow('INFO') + (`${member.user.tag} has been kicked by ${message.author.tag} because ${reason}`));
            message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
        } else {
            return message.reply(`${member} you do not have permission to use this`);
        }

    }

    //ban
    if (command === "ban") {
        if (message.member.hasPermission('BAN_MEMBERS')) {
            let member = message.mentions.members.first();
            if (!member)
                return message.reply("Please mention a valid member of this server");
            if (!member.bannable)
                return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

            let reason = args.slice(1).join(' ');
            if (!reason) reason = "No reason provided";

            await member.ban(reason)
                .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
            console.log(chalk.bgYellow('INFO:') + (`${member.user.tag} has been banned by ${message.author.tag} because ${reason}`));
            message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
        } else {
            return message.reply(`${member} you do not have permissions to use this`);
        }
    }
    //coinflip
    if (command === "coinflip") {
        var coinflip = [
            "Heads",
            "Tails"
        ];
        var coinflips = coinflip[Math.floor(Math.random() * coinflip.length)];
        message.channel.send(coinflips);
    }

    //ping
    if (command === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }



});


client.login(botToken);