const { Message } = require("discord.js");
const Calypso = require("../../utils/client");

module.exports = {
    name: 'loop',
    aliases: ['repeat'],
    category: 'music',
    args: true,
    usage: '<on / off>',
    memberPerms: ['CONNECT'],
    clientPerms: ['SPEAK'],
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

        const input = args[0]

        switch (input) {
            default: 
            message.channel.send({ embed: {
                description: '> ```🎵 Specify whether or not you want the queue to loop.```',
                footer: {
                    text: 'Say either "on" or "off"',
                    iconURL: client.user.displayAvatarURL()
                },
                color: "PURPLE"
            }})
            break;

            case 'on':
            player.setQueueRepeat(true)
            message.channel.send({ embed: {
                description: '> ```The queue is now being looped! 🎤```',
                color: "PURPLE",
                footer: {
                    text: `🎵 To turn it off use ${client.prefixes.get(message.guild.id) || client.configs.prefix}loop off`,
                    iconURL: client.user.displayAvatarURL()
                }
            }})
            break

            case 'off':
            player.setQueueRepeat(false)
            message.channel.send({ embed: {
                description: '> ```The queue is not being looped anymore! 🎤```',
                color: "PURPLE",
                footer: {
                    text: `🎵 To turn it off use ${client.prefixes.get(message.guild.id) || client.configs.prefix}loop off`,
                    iconURL: client.user.displayAvatarURL()
                }
            }})
            break
        } 
    }
}