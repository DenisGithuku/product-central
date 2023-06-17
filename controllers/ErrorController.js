const AppError = require(`${__dirname}/../util/AppError`)
const handleCastError = (err) => {
    let message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message).join(', ')
    const message = `Invalid input data: ${errors}`
    return new AppError(message, 400)
}

const {JsonWebTokenError, TokenExpiredError} = require("jsonwebtoken");

const handleInvalidIdError = (err) => {
    let message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400);
}

const handleInvalidJWTError = (err) => {
    return new AppError(`${err.message}`, 401)
}
const handleExpiredJWT = (err) => new AppError('Your token has expired! Please log in again', 401)

const handleDuplicateFields = (err) => {
    const dupFields = Object.keys(err.keyValue)
    const message = `Duplicate ${dupFields}. Please use another value`
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
        if (err.name === 'ValidationError') {
            error = handleValidationError(err)
        }
        if (err.name === 'JsonWebTokenError') {
            error = handleInvalidJWTError(err)
        }
        if (err instanceof TokenExpiredError) {
            error = handleExpiredJWT(err)
        }
        if (err.code === 11000) {
            error = handleDuplicateFields(err)
        }
        sendProdError(error, res)
    }
}