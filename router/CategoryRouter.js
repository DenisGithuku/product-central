const express = require('express')
const router = express.Router()
const {GetProductCategories, AddCategory} = require(`${__dirname}/../controllers/CategoryController`)

router
    .route("/")
    .get(GetProductCategories)
    .post(AddCategory)

module.exports = router