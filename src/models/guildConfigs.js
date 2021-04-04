const { Schema, model } = require('mongoose');

const guildConfigs = new Schema({
    gId: { type: String, required: true },
    prefix: { type: String, required: true },
    premium: { type: String, required: false }
});

module.exports = model('guild-configs', guildConfigs);
