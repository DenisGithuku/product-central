const express = require('express')
const router = express.Router()
const {
    GetAllProducts,
    GetProductById,
    AddNewProduct,
    UploadProductPhoto,
    UpdateProduct,
    DeleteProduct,
    ResizeProductPhoto
} = require(`${__dirname}/../controllers/ProductController`)
const {RestrictTo, Protect} = require(`${__dirname}/../controllers/AuthController`)


router
    .route("/")
    .get(Protect, GetAllProducts)
    .post(Protect, RestrictTo('admin'), UploadProductPhoto, ResizeProductPhoto, AddNewProduct)

router
    .route("/:id")
    .get(Protect, GetProductById)
    .patch(Protect, RestrictTo('admin'), UploadProductPhoto, ResizeProductPhoto, UpdateProduct)
    .delete(Protect, RestrictTo('admin'), DeleteProduct)

module.exports = router