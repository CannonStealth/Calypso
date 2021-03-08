const mongoose = require('mongoose')

const guildConfigs = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },

    prefix: {
        type: String,
        required: true
    },

    premium: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model('guild-configs', guildConfigs)