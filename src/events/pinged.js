const { MessageEmbed } = require("discord.js");
const Calypso = require("../utils/client");
/**
 * @param {Calypso} client 
 */
module.exports = client => {
    client.on('message', message => {
        if (message.content === `<@!${client.user.id}>`) {
            const embed = new MessageEmbed()
            .setTitle('I\'ve Been Pinged!')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields({
                name: 'Ping 🏓',
                value: `\`${client.ws.ping}ms\``
            }, {
                name: 'Prefix 📫',
                value: `\`${client.prefixes.get(message.guild.id) || client.configs.prefix}\``
            })
            .setColor("ORANGE")
            .setTimestamp()
            message.channel.send(embed)
        }
    })
}