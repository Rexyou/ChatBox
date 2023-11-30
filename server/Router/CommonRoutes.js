const express = require('express');
const router = express.Router()
const { sendEmailFunction, verifyRegisterToken } = require('../Controller/CommonController')
const { SendEmailValidator, VerifyTokenValidation } = require('../Validations/commonValidation')

router.route('/send_email').post(SendEmailValidator, sendEmailFunction)
router.route('/verify_register_token').post(VerifyTokenValidation, verifyRegisterToken)

module.exports = router