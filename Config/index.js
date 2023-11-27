const dotenv = require('dotenv');
dotenv.config();

const config = {
    service: "gmail",
    host: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
}

module.exports = {
    port: process.env.PORT,
    config: config
}