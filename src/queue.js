const { Message, MessageEmbed } = require("discord.js");
const Calypso = require("../../utils/client");

module.exports = {
    name: 'queue',
    aliases: ['q'],
    category: 'music',
    memberPerms: ['CONNECT'],
    clientPerms: ['SPEAK'],
    /**
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
        
        const queue = player.queue
        const embed = new MessageEmbed()
        .setAuthor(`Queue in ${message.guild.name}`, message.guild.iconURL())
        const multiple = 5
        const page = args.length && Number(args[0]) ? Number(args[0]) : 1

        const end = page * multiple
        const start = end - multiple

        const tracks = queue.slice(start, end)
        if (queue.current) embed.addField(`Current`, `> \\🎵 [${queue.current.title}](${queue.current.uri})`)
        if (!tracks.length) embed.setDescription(`No tracks in ${page > 1 ? `Page ${page}` : `the queue`}.`)
        else embed.setDescription(tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri})`).join('\n'))

        const maxPages = Math.ceil(queue.length / multiple)

        embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`)

        return message.channel.send(embed)
    }
}