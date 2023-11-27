const mongoose = require('mongoose')
const { tableStatus } = require('../Config/setting')

const TokenModel = mongoose.Schema({

    type: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    token: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255
    },
    status: {
        type: Number,
        default: tableStatus.ACTIVE
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("Tokens", TokenModel)