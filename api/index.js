const morgan = require('morgan')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const express = require('express')
const rateLimit = require('express-rate-limit')
const index = new express()

const AppError = require(`${__dirname}/../util/AppError`)
const GlobalErrorHandler = require(`${__dirname}/../controllers/ErrorController`)

const ProductRouter = require(`${__dirname}/../router/ProductRouter`)
const ReviewRouter = require(`${__dirname}/../router/ReviewRouter`)
const CategoryRouter = require(`${__dirname}/../router/CategoryRouter`)
const UserRouter = require(`${__dirname}/../router/UserRouter`)

if (process.env.NODE_ENV === 'development') {
    index.use(morgan('dev'))
}

// Security headers
index.use(helmet())

const limiter = rateLimit({
    max: 1000,
    windowMS: 60 * 60 * 100,
    message: 'Too many request from this IP, please try again in an hour'
})

index.use('/api', limiter)

index.use(express.json({limit: '10kb'}))

index.use((req, res, next) => {
    req.requestedAt = new Date()
    next()
})

// Sanitization
index.use(mongoSanitize())

// prevent xss attacks
index.use(xssClean())

index.use(express.static(`${__dirname}/../public`))

index.use((req, res, next) => {
    console.log("Made with ❤ and ☕ ....")
    next()
})

index.use("/api/v1/categories", CategoryRouter)
index.use("/api/v1/products", ProductRouter)
index.use("/api/v1/reviews", ReviewRouter)
index.use("/api/v1/users", UserRouter)

index.use('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server. Please fix your route!`, 500))
})

index.use(GlobalErrorHandler)

module.exports = index