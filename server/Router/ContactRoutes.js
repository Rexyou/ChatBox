const express = require('express');
const router = express.Router();
const { sendRequest, getContactList, updateContactStatus, searchContact } = require('../Controller/ContactController');
const validateToken = require('../Middlewares/validateToken');

router.use(validateToken)
router.route('/list/:status?').get(getContactList)
router.route('/send_request').post(sendRequest)
router.route('/update_request/:contact_id/:status').post(updateContactStatus)
router.route('/search').post(searchContact)

module.exports = router