const { body, validationResult } = require('express-validator')

const SendEmailValidator = [
    body('to_address')
        .notEmpty().withMessage('email_cannot_be_empty')
        .isLength({min:8, max: 40}).withMessage('email_length_incorrect')
        .isEmail().withMessage('email_format_invalid'),

    body('subject')
        .notEmpty().withMessage('subject_cannot_be_empty')
        .isLength({min:10, max: 200}).withMessage('subject_length_incorrect')
        .matches(/^[\w\d\s\,\.\_\-\/]+$/).withMessage('subject_format_invalid'),

    body('text')
        .notEmpty().withMessage('text_cannot_be_empty')
        .isLength({min:1, max: 355}).withMessage('text_length_incorrect')
        .matches(/^[\w\d\s\,\.\_\-\/]+$/).withMessage('text_format_invalid'),

    // (req, res, next) => {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.status(422).json({ status: false, data: "", message: errors.array(), code: 422 });
    //     }
    //     next();
    // },
]

const VerifyTokenValidation = [
    body('email')
        .notEmpty().withMessage('email_cannot_be_empty')
        .isLength({min: 8, max: 40}).withMessage('email_length_incorrect')
        .isEmail().withMessage("email_format_invalid"),

    body('token')
        .notEmpty().withMessage('token_cannot_be_empty')
        .isLength({min: 1, max: 255}).withMessage('token_length_incorrect')
]

module.exports = {
    SendEmailValidator,
    VerifyTokenValidation
}