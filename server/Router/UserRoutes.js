const express = require('express')
const router = express.Router()
const { loginValidator, registerValidator, updateProfileValidator } = require('../Validations/userValidation')
const { login, register, profile, updateProfile } = require('../Controller/UserController')
const validateToken = require('../Middlewares/validateToken')

router.route('/login').post(loginValidator, login)
router.route('/register').post(registerValidator, register)

router.use(validateToken)
router.route('/profile').get(profile).post(updateProfileValidator, updateProfile)

module.exports = router