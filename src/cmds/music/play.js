const { Message } = require("discord.js");
const Calypso = require("../../utils/client");
const ms = require("ms");

module.exports = {
  name: "play",
  category: 'music',
  aliases: ["p"],
  args: true,
  usage: "<song>",
  memberPerms: ['CONNECT'],
  clientPerms: ['SPEAK'],
  /**
   *
   * @param {Calypso} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const { channel } = message.member.voice;

    if (!channel) {
      return message.channel.send({
        embed: {
          description: "> ```🎵 You must be in a voice channel to continue.```",
          color: "PURPLE",
          footer: {
            text: `Pssst! Join a voice channel, ${message.author.tag}!`,
            iconURL: client.user.displayAvatarURL(),
          },
        },
      });
    }

    const player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: channel.id,
      textChannel: message.channel.id,
      selfDeafen: true,
    });

    if (player.state !== "CONNECTED") player.connect();
    const song = args.slice(0).join(" ");
    let res;

    try {
      res = await player.search(song, message.author);
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        throw res.exception;
      }
    } catch (err) {
      return message.channel.send({
        embed: {
          description: `> \\🎵 There was an error while searching the web:\n> \`\`\`${err.message}\`\`\``,
          footer: {
            text: `⚠️ Try again later, or report this to the support server.`,
          },
        },
      });
    }

    player.queue.add(res.tracks[0]);

    if (!player.playing && !player.paused && !player.queue.size) {
      player.play();
      return message.channel.send({
        embed: {
          author: {
            name: "Now Playing...",
            iconURL: message.guild.iconURL(),
          },
          description: `> **Now Playing:** ${
            res.tracks[0].title
          }\n> **Made By:** ${res.tracks[0].author}\n> **Duration:** ${ms(
            res.tracks[0].duration,
            { long: true }
          )}`,
          footer: {
            text: `🎵 Wanna play more music? Use the "play" command!`,
          },
          thumbnail: {
            url: res.tracks[0].thumbnail,
          },
          color: "ORANGE",
        },
      });
    }

    if (player.playing && !player.paused && player.queue.size) {
      return message.channel.send({
        embed: {
          author: {
            name: "Queued...",
            iconURL: message.guild.iconURL(),
          },
          description: `> **Queued:** ${res.tracks[0].title}\n> **Made By:** ${
            res.tracks[0].author
          }\n> **Duration:** ${ms(res.tracks[0].duration, { long: true })}`,
          footer: {
            text: '🎵 Wanna play more music? Use the "play" command!',
          },
          thumbnail: {
            url: res.tracks[0].thumbnail,
          },
          color: "ORANGE",
        },
      });
    }
  },
};
