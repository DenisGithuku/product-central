const morgan = require('morgan')
const express = require('express')
const app = new express()

const ProductsRouter = require(`${__dirname}/router/ProductRouter`)

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())

app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    console.log("Made with ❤ and ☕ ....")
    next()
})

app.use("/api/v1/products", ProductsRouter)

app.use('*', (req, res, next) => {

})

module.exports = app