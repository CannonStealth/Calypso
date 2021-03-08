const { MessageEmbed } = require("discord.js");
const Calypso = require("../utils/client");

/**
 * @param {Calypso} client 
 */
module.exports = client => {
    client.on('guildCreate', guild => {
        const embed = new MessageEmbed({
            title: "Hey hey hey!",
            description: `> Hey there! It's me your friendly anime partner!\n> My current prefix is **\`${client.prefixes.get(guild.id) || client.configs.prefix}\`**\n> I have **music, moderation, economy** commands\n> and more!\n\n> This bot is currently in **beta** so feel free to report\n> bugs to the [support](https://discord.gg/k58tZGBfq3) server!\n\n> Do \`${client.prefixes.get(guild.id) || client.configs.prefix}help\`** to get started!`,
            color: null,
            author: {
                name: "Calypso",
                icon_url: client.user.displayAvatarURL()
            },
            thumbnail: {
                url: client.user.displayAvatarURL()
            },
        })

        const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))

        channel.send(embed)
       
    })
}