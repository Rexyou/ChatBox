const Message = require('../Model/MessageModel');
const Contact = require('../Model/ContactModel')
const asyncHandler = require('express-async-handler');
const { responseCode, tableStatus } = require('../Config/setting');

const sendMessage = async (data)=> {

    const { message, message_type, contact_id, current_id, list } = data

    const contact_details = await Contact.findOne({ _id: contact_id });
    if(!contact_details){
        return { status: false, data: '', message: 'contact_not_found', code: responseCode.NOT_FOUND }
    }

    const message_creation = await Message.create({ send_from_user: current_id, message, message_type, contact_id });
    if(!message_creation){
        return { status: false, data: '', message: 'message_send_failure', code: responseCode.SERVER_ERROR }
    }

    // Users partial online
    if(Object.keys(list).length < contact_details.total_connection){

        for(const user_id in list){    
            if(contact_details.sender_id != user_id){
                let current_notification = contact_details.sender_notification;
                current_notification += 1;

                await contact_details.updateOne({ sender_notification: current_notification })
            }
    
            if(contact_details.receiver_id != user_id){
                let current_notification = contact_details.receiver_notification;
                current_notification += 1;

                await contact_details.updateOne({ receiver_notification: current_notification })
            }
        }

    }

    const message_details = await Message.findOne({ _id: message_creation._id }).populate({ path: 'send_from_user', select: 'username', populate: { path: 'profile', select: 'image' } })

    return { status: true, data: message_details, message: 'success', code: responseCode.SUCCESS }

}

const getMessages = asyncHandler(async (req, res)=> {

    const { contact_id } = req.params
    let { page, limit } = req.query

    if(!page){
        page = 1
    }

    if(!limit){
        limit = 25
    }

    const check_contact_id = await Contact.findOne({ _id: contact_id })
    if(!check_contact_id){
        return { status: false, data: '', message: 'contact_not_found', code: responseCode.NOT_FOUND }
    }

    let getContactMessages = await Message.paginate(
                                { contact_id,  status: tableStatus.ACTIVE },
                                { 
                                    sort: { createdAt: 'desc' }, 
                                    populate: { 
                                                path: 'send_from_user',
                                                select: 'username',
                                                populate: {
                                                    path: 'profile',
                                                    select: 'image',
                                                } 
                                            }, 
                                    page,
                                    limit
                                },
                            );
    getContactMessages.docs = getContactMessages.docs.sort((a, b)=> {
        return new Date(a.createdAt) - new Date(b.createdAt)
    })

    return res.json({ status: true, data: getContactMessages, message: 'success', code: responseCode.SUCCESS })

})

const updateContact = async (data) => {
    const { contact_id, user_id, list } = data

    const contact_details = await Contact.findOne({ _id: contact_id })
    if(!contact_details){
        return { status: false, data: '', message: 'contact_not_found', code: responseCode.NOT_FOUND }
    }

    if(contact_details.total_connection === Object.keys(list).length){
        await contact_details.updateOne({ receiver_notification: 0, sender_notification: 0 })
    }
    else if(list[user_id]){

        if(user_id == contact_details.sender_id){
            await contact_details.updateOne({ sender_notification: 0 })
        }

        if(user_id == contact_details.receiver_id){
            await contact_details.updateOne({ receiver_notification: 0 })
        }

    }

}

module.exports = {
    sendMessage,
    getMessages,
    updateContact
}