const mongoose = require('mongoose');
// const { Schema } = mongoose;
const { userStatus, userType } = require('../Config/setting')

const UserModel = mongoose.Schema({

        username: {
            type: String,
            required: [ true, "username_require" ],
            trim: true,
            minLength: 8,
            maxLength: 10,
            unique: [ true, "username_exist" ],
            index: true
        },
        first_name: {
            type: String,
            required: [ true, "first_name_require" ],
            trim: true,
            minLength: 2,
            maxLength: 20,
            index: true
        },
        last_name: {
            type: String,
            required: [ true, "last_name_require" ],
            trim: true,
            minLength: 2,
            maxLength: 20,
            index: true
        },
        email: {
            type: String,
            required: [ true, "email_require" ],
            trim: true,
            minLength:8,
            maxLength: 40,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
            unique: true,
            index: true
        },
        phone_number: {
            type: String,
            required: [ true, "phone_number_require" ],
            trim: true,
            minLength: 10,
            maxLength: 13,
            match: [/^\+60\d{1,2}?[-]?\d{7,8}$/, 'Please fill a valid email address'],
            unique: true,
            index: true
        },
        password: {
            type: String,
            required: [ true, "password_require" ],
            minLength: 8,
            maxLength: 300,
        },
        type: {
            type: Number,
            default: userType.USER,
            index: true
        },
        status: {
            type: Number,
            default: userStatus.INACTIVE,
            index: true
        },
        // profile: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Profile" // Refers to the Profile model
        // },
        
    }, {
        timestamps: true,
        optimisticConcurrency: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

UserModel.virtual('profile', {
    ref: 'Profile',
    localField: '_id',
    foreignField: 'user',
    justOne: false
});

module.exports = mongoose.model("User", UserModel)