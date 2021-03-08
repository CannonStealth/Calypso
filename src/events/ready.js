const Calypso = require("../utils/client");

/**
 * 
 * @param {Calypso} client 
 */
module.exports = client => {
    client.on('ready', async () => {
        console.log(`${client.user.tag} is ready!`)
        console.log(`Currently in ${client.guilds.cache.size} guilds!`)
        client.manager.init(client.user.id)

        client.user.setPresence({
            activity: {
                name: 'more code 🎵',
                type: 'PLAYING'
            },
        })
    })
}