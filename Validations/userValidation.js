const { body } = require('express-validator')

const loginValidator = [
    body('email')
        .notEmpty().withMessage('email_cannot_be_empty')
        .isLength({min:8, max: 40}).withMessage('email_length_incorrect')
        .isEmail().withMessage('email_format_incorrect'),

    body('password')
        .notEmpty().withMessage('password_cannot_be_empty')
        .isLength({min:8, max: 16}).withMessage('password_length_incorrect'),
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

const updateProfileValidator = [
    body('image')
        .optional()
        .notEmpty().withMessage('image_cannot_be_empty')
        .isURL().withMessage('image_format_invalid'),

    body('address')
        .optional()
        .notEmpty().withMessage('address_cannot_be_empty')
        .isLength({min: 10, max: 255}).withMessage('address_length_incorrect')
        .matches(/^[\w\d\s\-\_\/\,\'\.]+$/).withMessage('address_format_invalid'),

    body('city')
        .optional()
        .notEmpty().withMessage('city_cannot_be_empty')
        .isLength({min: 5, max: 200}).withMessage('city_length_incorrect')
        .matches(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/).withMessage('city_format_invalid'),

    body('state')
        .optional()
        .notEmpty().withMessage('state_cannot_be_empty')
        .isLength({min: 5, max: 100}).withMessage('state_length_incorrect')
        .matches(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/).withMessage('state_format_invalid'),
    
    body('country')
        .optional()
        .notEmpty().withMessage('country_cannot_be_empty')
        .isLength({min: 2, max: 3}).withMessage('state_length_incorrect')
        .matches(/^[A-Z]{2,3}$/).withMessage('country_format_invalid'),
    
    body('date_of_birth')
        .optional()
        .notEmpty().withMessage('date_of_birth_cannot_be_empty')
        .isDate({ format: 'YYYY-mm-dd' }).withMessage('date_of_birth_format_invalid'),

    body('gender')
        .optional()
        .notEmpty().withMessage('gender_cannot_be_empty')
        .isInt({ min: 1, max: 3 }).withMessage('gender_format_invalid'),
]

module.exports = { 
    loginValidator, 
    registerValidator,
    updateProfileValidator 
};