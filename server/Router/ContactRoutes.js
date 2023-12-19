const express = require('express');
const router = express.Router();
const { sendRequest, getContactList, updateContactStatus, searchContact, verifyContact, getChatContactList } = require('../Controller/ContactController');
const validateToken = require('../Middlewares/validateToken');

router.use(validateToken)
router.route('/list/:status?').get(getContactList)
router.route('/send_request').post(sendRequest)
router.route('/update_request/:contact_id/:status').post(updateContactStatus)
router.route('/search').post(searchContact)
router.route('/verify_contact').post(verifyContact)
router.route('/chat_list').get(getChatContactList)

module.exports = router