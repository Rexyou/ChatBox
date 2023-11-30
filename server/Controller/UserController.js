const asyncHandler = require('express-async-handler')
const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../Model/UserModel')
const Profile = require('../Model/ProfileModel')
const { sendEmail, generateToken } = require('./CommonController')

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
        { expiresIn: '1d' }
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
        
        const create_profile = await Profile.create({ user: creation_user._id, country })
        if(!create_profile){
            res.status(500)
            throw new Error("creation_profile_failure")
        }
        
        // First method
        creation_user.profile = create_profile

        // Second method
        // creation_user.profile = create_profile._id
        creation_user.save()

        // Create token
        req.body = {}
        req.body = { type: "register_token", user_id: creation_user._id }
        const token_result = await generateToken(req, res);
        if(!token_result.status){
            res.status(token_result.code)
            throw new Error(token_result.message)
        }

        req.body = {};
        req.body = { to_address: email, subject: "Welcome to ChatBox", text: `Click this link to activate your account ${token_result.data}` }

        const result = await sendEmail(req, res)
        if(!result.status){
            res.status(result.code)
            throw new Error(result.message)
        }
        
        return res.json({ status: true, data: "", message: 'success', code: 200 })
        
    } catch (error) {
    
        let code = error.code;

        if(code > 600 || code === undefined){
            code = 500;
        }

        res.status(code)
        console.log(error)
        throw new Error(error)

    }

})

const profile = asyncHandler(async (req, res)=> {

    const { email, username, id } = req.user

    const user_details = await User.findOne({ _id: id, username, email }).populate('profile');
    if(!user_details){
        res.status(404)
        throw new Error("user_not_found");
    }

    return res.json({ status: true, data: user_details, message: 'success', code: 200 })

})

const updateProfile = asyncHandler(async (req, res)=>{

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({ status: false, data: "", message: errors.array(), code: 422 })
    }

    const { email, username, id } = req.user

    const user_details = await User.findOne({ _id: id, username, email }).populate('profile');
    if(!user_details){
        res.status(404)
        throw new Error("user_not_found");
    }
    
    const params = req.body;

    const profile = user_details.profile
    Object.assign(profile, params)
    const result = await profile.save()
    if(!result){
        res.status(500)
        throw new Error("profile_update_failure")
    }

    return res.json({ status: true, data: { profile }, message: 'success', code: 200 })
})

module.exports = {
    login,
    register,
    profile,
    updateProfile
}