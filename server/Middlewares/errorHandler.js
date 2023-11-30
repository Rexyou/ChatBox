const errorHandler = (err, req, res, next) => {
    let statusCode = req.statusCode ? req.statusCode : err.status
    
    // err also error
    if(statusCode == undefined){
        statusCode = 500
    }

    res.status(statusCode).json({ status: false, data: err.stack, message: err.message, code: statusCode })
}

module.exports = errorHandler