const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../Model/UserModel')
const { userStatus } = require('../Config/setting')

const validateToken = asyncHandler(async(req, res, next)=> {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, async (err, decoded)=> {
            if(err){
                return res.status(401).json({ status: false, data: '', message: "user_not_authorized", code: 401 })
            }

            const user_profile = await User.findById({ _id: decoded.user.id });
            if(user_profile.status != userStatus.ACTIVE){
                return res.status(401).json({ status: false, data: '', message: "user_not_authorized", code: 401 })
            }

            // Assign user to current req
            req.user = decoded.user
            next()
        })
    }

    if(!token){
        res.status(500)
        throw new Error("token_invalid")
    }
    
})

module.exports = validateToken