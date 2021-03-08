const { Message } = require("discord.js")
const Calypso = require("../../utils/client")

module.exports = {
    name: 'skip',
    aliases: ['next'],
    memberPerms: ['CONNECT'],
    clientPerms: ['SPEAK'],
    category: 'music',
    /**
     * 
     * @param {Calypso} client 
     * @param {Message} message 
     * @param {String} args 
     */
    run: async (client, message, args) => {
        const player = client.manager.get(message.guild.id)
        if (!player) return message.channel.send({ embed: {
            description: '> ```🎵 There is no current music playing.```',
            color: "PURPLE"
        }})

        const { channel } = message.member.voice

        if (!channel) {
            return message.channel.send({ embed: {
                description: '> ```🎵 You must be in a voice channel to continue.```',
                color: "PURPLE",
                footer: {
                    text: `Pssst! Join a voice channel, ${message.author.tag}!`,
                    iconURL: client.user.displayAvatarURL()
                }
            }})
        }

        if (channel.id !== player.voiceChannel) {
            return message.channel.send({ embed: {
                description: '> ```🎵 You need to be in the same voice channel as the bot!```',
                color: "PURPLE"
            }})
        }

        if (!player.queue.current) {
            return message.channel.send({ embed: {
                description: '> ```🎵 There is not current music playing.```',
                color: "PURPLE",
            }})
        }

        const { title } = player.queue.current

        player.stop()
        return message.channel.send({ embed: {
            author: {
                text: 'Skipping...',
                iconURL: message.guild.iconURL()
            },
            description: `> **Skipping:** ${title}`,
            color: "PURPLE"
        }})
    }
}