const Contact = require('../Model/ContactModel');
const ContactStatusLog = require('../Model/ContactStatusLog');
const User = require('../Model/UserModel');
const asyncHandler = require('express-async-handler')
const { tableStatus, responseCode, contactStatus, userStatus } = require('../Config/setting')

const sendRequest = asyncHandler(async (req, res)=> {

    const { receiver_id } = req.body
    const current_user = req.user

    if(receiver_id == current_user.id){
        res.status(responseCode.SERVER_ERROR)
        throw new Error("receiver_id_conflict");
    }

    const exists = await User.exists({ _id: receiver_id, status: tableStatus.ACTIVE });
    if(!exists){
        res.status(responseCode.NOT_FOUND)
        throw new Error("receiver_not_found")
    }

    const connection_exists = await Contact.findOne({ 
                                $and: [{ status: tableStatus.ACTIVE, 
                                            $or: [
                                                    {
                                                        $and: [
                                                            { sender_id: current_user.id },
                                                            { receiver_id }
                                                        ]
                                                    },
                                                    {
                                                        $and: [
                                                            { sender_id: receiver_id },
                                                            { receiver_id: current_user.id }
                                                        ]
                                                    }
                                                ] 
                                        }]
        
                                })
    if(connection_exists.length !== 0){

        const current_status = connection_exists.connection_status

        console.log(current_status)

        if(current_status == contactStatus.UNFRIEND){
            
            const update_records = await connection_exists.updateOne({ connection_status: contactStatus.INITIAL })
            if(!update_records){
                res.status(responseCode.SERVER_ERROR)
                throw new Error("update_failure")
            }

            let sender_id = connection_exists.sender_id
            let receiver_id = connection_exists.receiver_id
            if(current_user.id != sender_id){
                sender_id = connection_exists.receiver_id
                receiver_id = connection_exists.sender_id
            }

            const create_log_result = await createContactStatusLog({ 
                contact_id: connection_exists._id,
                sender_id,
                receiver_id,
                type: "send_request",
                current_status,
                incoming_status: contactStatus.INITIAL,
            });
            if(!create_log_result.status){
                res.status(responseCode.SERVER_ERROR)
                throw new Error("contact_log_record_failure")
            }

            return res.json({ status: true, data: '', message: "success", code: responseCode.SUCCESS })

        }

        res.status(responseCode.SERVER_ERROR)
        throw new Error("contact_created")
    }
    // Create new contact
    else {

        const create_contact = await Contact.create({ sender_id: current_user.id, receiver_id });
        if(!create_contact){
            res.status(responseCode.SERVER_ERROR)
            throw new Error("Contact_creation_failure")
        }
    
        // Create Log
        const create_log_result = await createContactStatusLog({ 
                                    contact_id: create_contact._id,
                                    sender_id: create_contact.sender_id,
                                    receiver_id: create_contact.receiver_id,
                                    type: "send_request",
                                    current_status: contactStatus.INITIAL,
                                    incoming_status: contactStatus.INITIAL,
                                });
        if(!create_log_result.status){
            res.status(responseCode.SERVER_ERROR)
            throw new Error("contact_log_record_failure")
        }

    }
                                
    return res.json({ status: true, data: '', message: "success", code: responseCode.SUCCESS })

})

const createContactStatusLog = async (data) => {

    const create_contact_log = await ContactStatusLog.create(data)
    if(!create_contact_log){
        return { status: false, data: '', message: 'contact_log_create_failure', code: responseCode.SERVER_ERROR }
    }

    return { status: true, data: '', message: 'success', code: responseCode.SUCCESS }

}

const getContactList = asyncHandler(async (req, res)=> {

    const current_user = req.user;

    let default_status = contactStatus.FRIEND
    if(req.params.status){
        default_status = req.params.status
    }

    let condition = { $or: [ { sender_id: current_user.id }, { receiver_id: current_user.id } ] }
    if(default_status == contactStatus.INITIAL){
        condition = { receiver_id: current_user.id }
    }

    const contact_list = await Contact.find({ connection_status: default_status, ...condition })
                                    .populate('sender_id').populate('receiver_id');
    if(!contact_list){
        contact_list = {}
    }

    return res.status(responseCode.SUCCESS).json({ status: true, data: contact_list, message: 'success', code: responseCode.SUCCESS })

})

const updateContactStatus = asyncHandler(async (req, res)=> {

    const { contact_id, status } = req.params
    const current_user = req.user

    const connection_exists = await Contact.findOne({ _id: contact_id, $or : [ { sender_id: current_user.id }, { receiver_id: current_user.id } ]});
    if(connection_exists.length === 0){
        res.status(responseCode.NOT_FOUND)
        throw new Error("contact_not_found")
    }

    const current_status = connection_exists.connection_status

    if(current_status == status){
        res.status(responseCode.UNAUTHENTICATED)
        return new Error("same_status")
    }

    if(current_status == contactStatus.BLOCK){
        const checker = await ContactStatusLog.findOne({ contact_id }).sort({ createdAt: 1 });
        if(!checker.length === 0){
            res.status(responseCode.NOT_FOUND)
            throw new Error("record_not_found")
        }

        if(checker.sender_id != current_user.id){
            res.status(responseCode.UNAUTHENTICATED)
            throw new Error("not_able_unblock")
        }

        if(status == contactStatus.INITIAL){
            res.status(responseCode.VALIDATION_ERROR)
            throw new Error("status_not_allow")
        }
    }

    const updateStatus = await connection_exists.updateOne({ connection_status: status });
    if(!updateStatus){
        res.status(responseCode.SERVER_ERROR)
        throw new Error("contact_status_update_failure")
    }

    let receiver_id = connection_exists.receiver_id;
    if(connection_exists.sender_id != current_user.id){
        receiver_id = connection_exists.sender_id
    }

    // Create Log
    const create_log_result = await createContactStatusLog({ 
                                contact_id,
                                sender_id: current_user.id,
                                receiver_id,
                                type: "upadate_request",
                                current_status: current_status,
                                incoming_status: status,
                            });

    if(!create_log_result.status){
        res.status(responseCode.SERVER_ERROR)
        throw new Error("contact_log_record_failure")
    }

    return res.json({ status: true, data: '', message: 'success', code: responseCode.SUCCESS })

})

const searchContact = asyncHandler(async (req, res)=> {

    const { target_value } = req.body
    const current_user = req.user

    const contacts = await Contact.find({ $or: [ { sender_id: current_user.id }, { receiver_id: current_user.id } ], connect_status: { $ne: contactStatus.UNFRIEND } })
    const existUserId = contacts.map(contact => {
        return contact.sender_id == current_user.id ? contact.receiver_id : contact.sender_id;
    })

    const response = await User.find({ 
                            $or: [
                                { username: { $regex: `.*${target_value}.*` } }, 
                                { first_name: { $regex: `.*${target_value}.*` } }, 
                                { last_name: { $regex: `.*${target_value}.*` } }, 
                                { email: { $regex: `.*${target_value}.*` } }, 
                            ],
                            status: userStatus.ACTIVE,
                            $and: [
                                { _id: { $ne: current_user.id } },
                                { _id: { $nin: existUserId } }
                            ]
                        })
    if(!response){
        response = {}
    }

    return res.json({ status: true, data: response, message: 'success', code: responseCode.SUCCESS })

})

module.exports = {
    sendRequest,
    getContactList,
    updateContactStatus,
    searchContact
}