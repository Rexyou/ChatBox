const express = require('express')
const router = express.Router()
const { sendMessage } = require('../Controller/ChatController');
const validateToken = require('../Middlewares/validateToken');

router.use(validateToken)
router.route('/send_message').post(sendMessage);

module.exports = router