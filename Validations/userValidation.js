const { body } = require('express-validator')

const loginValidator = [
    body('email', 'email_cannot_be_empty').notEmpty(),
    body('email', 'email_format_incorrect').isEmail(),
    body('password', 'password_min_6').isLength({min: 6}),
]

const registerValidator = [
    body('username')
        .notEmpty().withMessage('username_cannot_be_empty')
        .isAlphanumeric().withMessage('username_format_invalid')
        .isLength({min:8, max: 10}).withMessage('username_length_incorrect'),

    body('first_name')
        .notEmpty().withMessage('first_name_cannot_be_empty')
        .isAlpha().withMessage('first_name_format_invalid')
        .isLength({min:2, max: 20}).withMessage('first_name_length_incorrect'),

    body('last_name')
        .notEmpty().withMessage('last_name_cannot_be_empty')
        .isAlpha().withMessage('last_name_format_invalid')
        .isLength({min:2, max: 20}).withMessage('last_name_length_incorrect'),

    body('email')
        .notEmpty().withMessage('email_cannot_be_empty')
        .isLength({min:8, max: 40}).withMessage('email_length_incorrect')
        .isEmail().withMessage('email_format_incorrect'),

    body('phone_number')
        .notEmpty().withMessage('phone_number_cannot_be_empty')
        .isLength({min:10, max: 13}).withMessage('phone_number_length_incorrect')
        .isMobilePhone('ms-MY').withMessage('phone_number_format_incorrect'),

    body('password')
        .notEmpty().withMessage('password_cannot_be_empty')
        .isLength({min:8, max: 16}).withMessage('password_length_incorrect'),

    body('password_confirmation')
        .notEmpty().withMessage('password_confirmation_cannot_be_empty')
        .isLength({min: 8, max: 16}).withMessage('password_confirmation_length_incorrect')
        .custom((value, {req})=> value === req.body.password).withMessage('password_confirmation_not_match'),

    body('country')
        .notEmpty().withMessage('country_cannot_be_empty')
        .isLength({min: 2, max: 3}).withMessage('country_length_incorrect'),
]

module.exports = { 
    loginValidator, 
    registerValidator 
};