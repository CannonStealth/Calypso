const Calypso = require("../utils/client");

/**
 * @param {Calypso} client
 */
module.exports = (client) => {
  client.on("message", async (message) => {
    const prefix = client.prefixes.get(message.guild.id) || client.configs.prefix
    if (
      message.author.bot ||
      !message.guild ||
      !message.content.toLowerCase().startsWith(prefix.toLowerCase())
    )
      return;
    
    
    const [cmd, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    const command = client.getCommand(cmd.toLowerCase());
    if (!command) return;

    if (command.category) {
      let cateogries = client.categories.get(command.category.toLowerCase())
      if (!cateogries) cateogries = [command.category]
      cateogries.push(command.name)

      client.categories.set(command.category.toLowerCase(), cateogries)
      console.log(client.categories)
    }

    if (command.args && !args.length) {
      let reply = `> <:error:817143507989954570> You did not provide any additional input!`;

      if (command.usage) {
        reply += `\n> Usage: \`${prefix}${command.name} ${command.usage}\``;
      }

      return message.channel.send(reply)
    }

    if (command.memberPerms) {
      const authorPerms = message.channel.permissionsFor(message.author)
      if (!authorPerms || !authorPerms.has(command.memberPerms)) {
        return message.channel.send({ embed: {
          description: `> <:error:817143507989954570> You will need to have a special permission to proceed!`,
          color: "ORANGE"
        }})
      } 
    }

    if (command.clientPerms) {
      const botPerms = message.channel.permissionsFor(message.guild.me)
      if (!botPerms || !botPerms.has(command.clientPerms)) {
        return message.channel.send(`> <:error:817143507989954570> Please give me the \`${command.clientPerms}\` permission!\n> I need it to execute this command!`)
        }
    }

    try {
      await command.run(client, message, args);
    } catch (err) {
      message.channel.send({ embed: {
        description: `> There was an error running this command!\n> \`\`\`${err}\`\`\`\n> Please report this to the support server!`,
        color: "RED",
      }})
      console.log(
        `There was an error running the "${command.name}" command:`,
        err
      );
    }
  });
};
