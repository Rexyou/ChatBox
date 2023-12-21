const mongoose = require('mongoose')
const { tableStatus, contactStatus } = require('../Config/setting')
const mongoosePaginate = require('mongoose-paginate-v2')
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

ContactModel.virtual('chat_record', {
    ref: 'Chat_Record',
    localField: '_id',
    foreignField: 'contact_id',
    justOne: true,
    options: { sort: { 'createdAt': -1 }, limit: 1 },
});

ContactModel.plugin(mongoosePaginate)
ContactModel.plugin(aggregatePaginate);

module.exports = mongoose.model('Contact', ContactModel)