const morgan = require('morgan')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const express = require('express')
const app = new express()

const AppError = require(`${__dirname}/util/AppError`)
const GlobalErrorHandler = require(`${__dirname}/controllers/ErrorController`)

const ProductsRouter = require(`${__dirname}/router/ProductRouter`)
const ReviewsRouter = require(`${__dirname}/router/ReviewRouter`)

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Security headers
app.use(helmet())

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

app.use("/api/v1/products", ProductsRouter)
app.use("/api/v1/reviews", ReviewsRouter)

app.use('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server. Please fix your route!`, 500))
})

app.use(GlobalErrorHandler)

module.exports = app