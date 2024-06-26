const mongoose = require('mongoose')
const { userStatus } = require('../Config/setting')

const ProfileModel = mongoose.Schema({
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
        minLength: 5,
        maxLength: 200
    },
    state: {
        type: String,
        minLength: 5,
        maxLength: 100
    },
    country: {
        type: String,
        minLength: 2,
        maxLength: 3
    },
    date_of_birth: {
        type: String,
        match: [/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/, 'Please fill a valid email address'],
    },
    gender: {
        type: Number,
        min: 1,
        max: 3
    },
    remember_me_setting: {
        type: Boolean
    },
    status: {
        type: Number,
        default: userStatus.INACTIVE
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Refers to the User model
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Profile", ProfileModel)