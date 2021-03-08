const { Message, MessageEmbed } = require("discord.js");
const Calypso = require("../utils/client");

module.exports = {
  name: "help",
  aliases: ["h"],
  category: "utils",
  /**
   *
   * @param {Calypso} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const category = client.categories.forEach(category => {
      console.log(category)
    })
    if (!args.length) {
      const embed = new MessageEmbed()
        .setAuthor(
          `${client.user.username}'s Commands 📫`,
          client.user.displayAvatarURL()
        )
        .setDescription(
          `> Total Commands: **${client.commands.size}**\n> Prefix: **\`${
            client.prefixes.get(message.guild.id) || client.configs.prefix
          }\`**`
        );
      return message.channel.send(embed);
    }
  },
};
