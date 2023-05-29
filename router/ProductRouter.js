const express = require('express')
const router = express.Router()
const {GetAllProducts} = require(`${__dirname}/../controllers/ProductController`)

router
    .route("/")
    .get(GetAllProducts)

module.exports = router