const { Client, Collection } = require("discord.js");
const { Manager } = require("erela.js");
const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");
const ms = require("ms");
const { connect } = require("mongoose");
const guildConfigs = require("../models/guildConfigs");

class Calypso extends Client {
  constructor() {
    super({ ws: { properties: { $browser: 'Discord Android' }}});
    this.commands = new Collection();
    this.aliases = new Collection();
    this.prefixes = new Collection();
    this.categories = new Collection()
    this.events = new Collection()
    this.configs = require('../../config.json')
    this.manager = new Manager({
      nodes: [{
        host: 'localhost',
        password: 'calypsothemoosicbot!',
        port: 2333, 
      }],
      send: (id, payload) => {
        const guild = this.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });
  }

  getCommand(cmd) {
    return this.commands.get(cmd) || this.commands.get(this.aliases.get(cmd));
  }

  music() {
    this.manager.on('playerMove', (oldChannel, newChannel) => {
      
    })
    this.manager.on("nodeConnect", (node) => {
      console.log(`Node "${node.options.identifier}" has connected!`);
    });
    this.manager.on("nodeError", (node, error) => {
      console.log(
        `Node "${node.options.identifier}" encountered an error: ${error.message}`
      );
    });
    this.on("raw", (raw) => {
      this.manager.updateVoiceState(raw);
    });
    this.manager.on("trackStart", (player, track) => {
      const channel = this.channels.cache.get(player.textChannel);
      channel.send({
        embed: {
          description: `\\🎵 **[${track.title}](${
            track.uri
          })**\n> **Made By:** ${
            track.author
          }\n> **Duration:** ${ms(track.duration, { long: true })}`,
          color: "ORANGE",
          footer: {
            text: `Requested by ${track.requester.tag}`,
            iconURL: track.requester.displayAvatarURL(),
          },
        },
      });
    });
    this.manager.on("queueEnd", (player) => {
      const channel = this.channels.cache.get(player.textChannel);
      channel.send({
        embed: {
          description: "> ```🎵 The queue has ended, and I have left. 👋```",
          color: "ORANGE",
        },
      });
      player.destroy()
    });
  }

  handlers() {
    const readCmds = (dir) => {
      const files = readdirSync(join(__dirname, dir));
      for (const file of files) {
        const stat = lstatSync(join(__dirname, dir, file));
        if (stat.isDirectory()) {
          readCmds(join(dir, file));
        } else {
          const command = require(join(__dirname, dir, file));
          this.commands.set(command.name, command);
          if (command.aliases)
            command.aliases.map((alias) =>
              this.aliases.set(alias, command.name)
            );
        }
      }
    };

    readCmds("../cmds");

    const readEvents = (dir) => {
      const files = readdirSync(join(__dirname, dir));
      for (const file of files) {
        const stat = lstatSync(join(__dirname, dir, file));
        if (stat.isDirectory()) {
          readEvents(join(dir, file));
        } else {
          const event = require(join(__dirname, dir, file));
          if (typeof event !== "function") {
            console.log(`"${file}" does not have a "client" feature`);
          } else {
            this.events.set(event)
            event(this);
          }
        }
      }
    };

    readEvents("../events");
  }

  connection() {
    connect(this.configs.mongoPath, {
      keepAlive: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
  }

  async loadPrefixes() {
    const results = await guildConfigs.find()

    if (!results) return

    for (const result of results) {
      if (!result.prefix) return

    this.prefixes.set(result.gId, result.prefix)
    }
  }

  start(token) {
    this.login(token);
    this.handlers();
    this.music()
    this.connection()
    this.loadPrefixes()

    console.log(`Registered: ${this.commands.size} commands!`)
    console.log(`Registered: ${this.events.size} events!`)

  }
}

module.exports = Calypso;
