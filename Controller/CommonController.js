const nodemailer = require('nodemailer')
const { config } = require('../Config/index')
const asyncHandler = require('express-async-handler')
const { validationResult } = require('express-validator')
// const { SendEmailValidator } = require('../Validations/commonValidation')
const UserToken = require('../Model/TokenModel')
const User = require('../Model/UserModel')
const { tableStatus } = require('../Config/setting')

const sendEmail = asyncHandler(async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return { status: false, data: '', message: errors.array(), code: 422 }
    }

    const { to_address, subject, text } = req.body

    // to_address validation
    if(!to_address || to_address === null || to_address === ""){
        return { status: false, data: '', message: "email_cannot_be_empty", code: 422 }
    }

    if(to_address.length < 8 || to_address.length > 40){
        return { status: false, data: '', message: "email_length_incorrect", code: 422 }
    }

    const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");
    const isValidEmail = emailRegex.test(to_address);
    if(!isValidEmail){
        return { status: false, data: '', message: "email_format_invalid", code: 422 }
    }

    // subject validation
    const subject_result = checkSubjectAndText(subject, "subject");
    if(!subject_result.status){
        return subject_result
    }

    // text validation
    const text_result = checkSubjectAndText(text, "text");
    if(!text_result.status){
        return text_result
    }

    const input = {
        "from": process.env.EMAIL_USER,
        "to": to_address,
        "subject": subject,
        "text": text
    }

    const transporter = nodemailer.createTransport(config)
    await transporter.sendMail(input)

    return { status: true, data: '', message: "success", code: 200 }
})

const sendEmailFunction = async(req, res)=> {
    
    const result = await sendEmail(req, res);

    return res.status(result.code).json(result);
}

const checkSubjectAndText = (data, target) => {

    let data_min_length = 10;
    let data_max_length = 200;

    if(target === "text"){
        data_min_length = 1;
        data_max_length = 355
    }

    if(!data || data === null || data === ""){
        return { status: false, data: '', message: `${target}_cannot_be_empty`, code: 422 }
    }

    if(data.length < data_min_length || data.length > data_max_length){
        return { status: false, data: '', message: `${target}_length_incorrect`, code: 422 }
    }

    const dataRegex = new RegExp(/^[\w\d\s\,\.\_\-\/]+$/, "gm");
    const isValidData = dataRegex.test(data);
    if(!isValidData){
        return { status: false, data: '', message: `${target}_format_invalid`, code: 422 }
    }

    return { status: true, data: '', message: "success", code: 200 }

}

const generateToken = asyncHandler(async (req, res)=> {

    const { type, user_id } = req.body

    const userExist = await User.exists({ _id: user_id });
    if(!userExist){
        return { status: false, data: "", message: "user_not_found", code: 404 }
    }

    // Genarate token
    const length = Math.floor(Math.random() * 18)+18;
    const a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    let b = [];
    
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }

    const token = b.join("");

    const token_creation = await UserToken.create({ type, token, user: user_id });
    if(!token_creation){
        return { status: false, data: "", message: "token_creation_failure", code: 500 }
    }

    return { status: true, data: token, message: "success", code: 200 }

})

const verifyRegisterToken = asyncHandler(async (req, res)=> {

    const errors = await validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({ status: false, data: '', message: errors.array(), code: 422 })
    }

    const { email, token } = req.body

    const token_filter = { type: "register_token", token, status: tableStatus.ACTIVE }
    const user_token = await UserToken.findOne(token_filter).populate('user');
    if(!user_token){
        return res.status(404).json({ status: false, data: '', message: 'token_not_found', code: 404 })
    }

    if(user_token.user.email !== email){
        return res.status(500).json({ status: false, data: '', message: "token_invalid", code: 500 })
    }

    const token_updation = await user_token.updateOne((token_filter, { status: tableStatus.INACTIVE }))
    if(!token_updation){
        res.status(500)
        throw new Error("token_update_failure")
    }

    user_token.user.status = tableStatus.ACTIVE
    const user_updation = await user_token.user.save();
    if(!user_updation){
        res.status(500)
        throw new Error("user_update_failure")
    }

    return res.json({ status: true, data: '', message: "success", code: 200 })

})

module.exports = {
    sendEmail,
    sendEmailFunction,
    generateToken,
    verifyRegisterToken
}