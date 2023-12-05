const userType = {
    USER: 1,
    MANAGEMENT: 2,
    ADMIN: 3
}

const userStatus = {
    INACTIVE: 0,
    ACTIVE: 1,
    TERMINATED: 2
}

const tableStatus = {
    INACTIVE: 0,
    ACTIVE: 1,
    TERMINATED: 2,
}

const responseCode = {
    SUCCESS: 200,
    UNAUTHENTICATED: 401,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 422,
    SERVER_ERROR: 500
}

const contactStatus = {
    INITIAL: 0,
    FRIEND: 1,
    UNFRIEND: 2,
    BLOCK: 3,
}

module.exports = { 
    userType, 
    userStatus,
    tableStatus,
    responseCode,
    contactStatus
};