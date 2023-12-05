const mongoose = require('mongoose')
const { tableStatus } = require('../Config/setting')

const ContactStatusLog = mongoose.Schema({

    contact_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact",
        required: true,
    },

    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    type: {
        type: String,
        required: true,
    },

    current_status: {
        type: Number,
        required: true,
    },

    incoming_status: {
        type: Number,
        required: true,
    },

    status: {
        type: Number,
        default: tableStatus.ACTIVE
    }

}, {
    timestamps: true,
})

module.exports = mongoose.model("Contact_Status_Log", ContactStatusLog)