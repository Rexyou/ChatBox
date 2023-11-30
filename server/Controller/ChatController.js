const Message = require('../Model/MessageModel');
const asyncHandler = require('express-async-handler');
const { responseCode } = require('../Config/setting')

const sendMessage = asyncHandler(async (req, res)=> {

    const { message, message_type, to_user_id } = req.body

    const current_user_id = req.user.id
    const room_id = current_user_id+"_"+to_user_id

    const message_creation = await Message.create({ send_from_user: current_user_id, message, message_type, room_id });
    if(!message_creation){
        res.status(responseCode.SERVER_ERROR)
        throw new Error("message_send_failure")
    }

    return res.status(responseCode.SUCCESS).json({ status: true, data: '', message: "success", code: responseCode.SUCCESS })

})

module.exports = {
    sendMessage
}