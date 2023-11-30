const mongoose = require('mongoose')
const { tableStatus } =require('../Config/setting')

const messageModel = mongoose.Schema({
    send_from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    message: {
        type: String,
        required: [ true, "message_require" ]
    },
    message_type: {
        type: String,
        required: true
    },
    room_id: {
        type: String,
        required: true
    },
    status: {
        required: [ true, "status_require"],
        type: Number,
        status: tableStatus.ACTIVE
    }
},{
    timestamps: true,
    optimisticConcurrency: true,
})

module.exports = mongoose.model('User_Relation', messageModel)