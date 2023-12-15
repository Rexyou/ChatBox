const express = require('express')
const router = express.Router()
const { sendMessage, getMessages } = require('../Controller/ChatController');
const validateToken = require('../Middlewares/validateToken');

router.use(validateToken)
router.route('/send_message').post(sendMessage);
router.route('/get_messages/:contact_id').get(getMessages);

module.exports = router