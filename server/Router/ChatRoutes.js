const express = require('express')
const router = express.Router()
const { sendMessage, getMessages, updateContact } = require('../Controller/ChatController');
const validateToken = require('../Middlewares/validateToken');

router.use(validateToken)
router.route('/send_message').post(sendMessage);
router.route('/get_messages/:contact_id').get(getMessages);
router.route('/update_contact').post(updateContact);

module.exports = router