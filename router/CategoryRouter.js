const express = require('express')
const router = express.Router()
const {GetProductCategories} = require(`${__dirname}/../controllers/CategoryController`)

router
    .route("/")
    .get(GetProductCategories)

module.exports = router