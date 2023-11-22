const asyncHandler = require('express-async-handler')
const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../Model/UserModel')
const Profile = require('../Model/ProfileModel')

const login = asyncHandler(async (req, res)=> {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({ status: false, data: '', message: errors.array(), code: 422 })
    }

    const { email, password } = req.body

    const user = await User.findOne({ email });
    if(!user){
        res.status(500)
        throw new Error("user_email_password_not_correct")
    }

    const compare_password = await bcrypt.compare(password, user.password);
    if(!compare_password){
        res.status(500)
        throw new Error("user_email_password_not_correct")
    }

    // Create token
    const token = jwt.sign(
        { user: { email: user.email, username: user.username, id: user.id } },
        process.env.ACCESS_SECRET_TOKEN,    
    );
    if(!token){
        res.status(500)
        throw new Error("token_creation_failure");
    }

    return res.json({ status: true, data: token, message: 'success', code: 200 })

})

const register = asyncHandler(async (req, res)=> {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({ status: false, data: "", message: errors.array(), code: 422 })
    }

    const { username, first_name, last_name, email, phone_number, password, country } = req.body

    // encrypt password
    let new_password = await bcrypt.hash(password, 8);

    try {

        const creation_user = await User.create({ username, first_name, last_name, email, phone_number, password: new_password });
        if(!creation_user){
            res.status(500)
            throw new Error("creation_user_failure")
        }

        const create_profile = await Profile.create({ user_id: creation_user._id, country })
        if(!create_profile){
            res.status(500)
            throw new Error("creation_profile_failure")
        }
        
        return res.json({ status: true, data: "", message: 'success', code: 200 })
        
    } catch (error) {
    
        let code = error.code;

        if(code > 600 || code === undefined){
            code = 500;
        }

        res.status(code)
        throw new Error(error.message)

    }

})

const profile = asyncHandler(async (req, res)=> {

    const { email, username, id } = req.user

    const user_details = await User.findOne({ _id: id });
    if(!user_details){
        res.status(404)
        throw new Error("user_not_found");
    }

    return res.json({ status: true, data: user_details, message: 'success', code: 200 })

})

module.exports = {
    login,
    register,
    profile
}