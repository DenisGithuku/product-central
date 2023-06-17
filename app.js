const morgan = require('morgan')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const express = require('express')
const rateLimit = require('express-rate-limit')
const app = new express()

const AppError = require(`${__dirname}/util/AppError`)
const GlobalErrorHandler = require(`${__dirname}/controllers/ErrorController`)

const ProductRouter = require(`${__dirname}/router/ProductRouter`)
const ReviewRouter = require(`${__dirname}/router/ReviewRouter`)
const CategoryRouter = require(`${__dirname}/router/CategoryRouter`)
const UserRouter = require(`${__dirname}/router/UserRouter`)

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Security headers
app.use(helmet())

const limiter = rateLimit({
    max: 1000,
    windowMS: 60 * 60 * 100,
    message: 'Too many request from this IP, please try again in an hour'
})

app.use('/api', limiter)

app.use(express.json({limit: '10kb'}))

app.use((req, res, next) => {
    req.requestedAt = new Date()
    next()
})

// Sanitization
app.use(mongoSanitize())

// prevent xss attacks
app.use(xssClean())

app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    console.log("Made with ❤ and ☕ ....")
    next()
})

app.use("/api/v1/categories", CategoryRouter)
app.use("/api/v1/products", ProductRouter)
app.use("/api/v1/reviews", ReviewRouter)
app.use("/api/v1/users", UserRouter)

app.use('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server. Please fix your route!`, 500))
})

app.use(GlobalErrorHandler)

module.exports = app