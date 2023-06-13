const AppError = require(`${__dirname}/../util/AppError`)
const handleCastError = (err) => {
    let message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}
const sendDevError = (err, res) => {
    res
        .status(err.statusCode)
        .json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
}

const sendProdError = (err, res) => {
    if (err.isOperational) {
        res
            .status(err.statusCode)
            .json({
                status: err.status,
                message: err.message
            })
    } else {
        res
            .status(err.statusCode)
            .json({
                status: 'fail',
                message: 'Something went wrong. Please try again later.'
            })
    }
}
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'


    if (process.env.NODE_ENV === 'development') {
        sendDevError(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = err
        if (err.name === "CastError") {
            error = handleCastError(err)
        }
        sendProdError(error, res)
    }
}