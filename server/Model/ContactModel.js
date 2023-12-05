const mongoose = require('mongoose')
const { tableStatus, contactStatus } = require('../Config/setting')

const ContactModel = mongoose.Schema({

    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    connection_status: {
        type: Number,
        default: contactStatus.INITIAL
    },

    status: {
        type: Number,
        default: tableStatus.ACTIVE
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Contact', ContactModel)