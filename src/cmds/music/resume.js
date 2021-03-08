const { Message } = require("discord.js");
const Calypso = require("../../utils/client");

module.exports = {
    name: 'resume',
    memberPerms: ['CONNECT'],
    clientPerms: ['SPEAK'],
    category: 'music',
    /**
     * 
     * @param {Calypso} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        const player = client.manager.get(message.guild.id)
        if (!player) return message.channel.send({ embed: {
            description: '> ```🎵 There is no current music playing.```',
            color: "PURPLE"
        }})

        const { channel }= message.member.voice

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

        if (!player.paused) return message.channel.send({ embed: {
            description: '> ```⚠️ The music is not paused.```',
            color: "PURPLE"
        }})

        player.pause(false)
        return message.channel.send({ embed: {
            description: '> ```🎵 The player has resumed!```',
            color: "PURPLE"
        }})
    }
}