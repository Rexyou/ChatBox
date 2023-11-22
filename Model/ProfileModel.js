const mongoose = require('mongoose')
const { userStatus } = require('../Config/setting')

const ProfileModel = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users",
        unique: true
    },
    image: {
        type: String
    },
    address: {
        type: String,
        minLength: 10,
        maxLength: 255
    },
    city: {
        type: String,
        minLength: 10,
        maxLength: 200
    },
    state: {
        type: String,
        minLength: 10,
        maxLength: 100
    },
    country: {
        type: String,
        minLength: 2,
        maxLength: 3
    },
    date_of_birth: {
        type: Date
    },
    gender: {
        type: Boolean
    },
    remember_me_setting: {
        type: Boolean
    },
    status: {
        type: Number,
        default: userStatus.INACTIVE
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("User_Profile", ProfileModel)