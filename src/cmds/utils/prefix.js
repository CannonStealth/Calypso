const { Message, MessageEmbed } = require("discord.js");
const guildConfigs = require("../../models/guildConfigs");
const Calypso = require("../../utils/client");

module.exports = {
    name: 'prefix',
    category: 'utils',
    aliases: ['setprefix', 'changeprefix', 'newprefix'],
    args: true,
    usage: '<new prefix>',
    memberPerms: ['ADMINISTRATOR'],
    clientPerms: ['MANAGE_GUILD'],
    /**
     * 
     * @param {Calypso} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        const prefix = args.slice(0).join(' ')
        const guildId = message.guild.id

        await guildConfigs.findOne({ _id: guildId })
        await guildConfigs.findOneAndUpdate({
            _id: guildId,
        }, {
            _id: guildId,
            prefix
        }, {
            upsert: true
        })
        client.prefixes.set(message.guild.id, prefix)

        const embed = new MessageEmbed()
        .setTitle('Prefix Change!')
        .addField('Prefix 📫', `\`${prefix}\``)
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
        .setColor("ORANGE")
        message.channel.send(embed)
    }
}