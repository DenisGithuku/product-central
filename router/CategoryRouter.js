const express = require('express')
const router = express.Router()
const {GetProductCategories, AddCategory} = require(`${__dirname}/../controllers/CategoryController`)
const {RestrictTo, Protect} = require(`${__dirname}/../controllers/AuthController`)

router
    .route("/")
    .get(Protect, GetProductCategories)
    .post(Protect, RestrictTo('admin'), AddCategory)

module.exports = router