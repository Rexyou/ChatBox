const mongoose = require('mongoose')
const { tableStatus } =require('../Config/setting')
const mongoosePaginate = require('mongoose-paginate-v2')

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
    contact_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact"
    },
    status: {
        required: [ true, "status_require"],
        type: Number,
        default: tableStatus.ACTIVE
    }
},{
    timestamps: true,
    optimisticConcurrency: true,
})

messageModel.plugin(mongoosePaginate)

module.exports = mongoose.model('Chat_Record', messageModel)