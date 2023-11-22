const express = require('express')
const router = express.Router()
const { loginValidator, registerValidator } = require('../Validations/userValidation')
const { login, register } = require('../Controller/UserController')

router.route('/login').post(loginValidator, login)
router.route('/register').post(registerValidator, register)

module.exports = router