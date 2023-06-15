const express = require('express')
const router = express.Router()
const {
    GetAllProducts,
    GetProductById,
    AddNewProduct,
    UploadFilePhoto,
    GetProductCategories,
    UpdateProduct,
    DeleteProduct
} = require(`${__dirname}/../controllers/ProductController`)

router
    .route("/")
    .get(GetAllProducts)
    .post(UploadFilePhoto, AddNewProduct)

router
    .route("/:id")
    .get(GetProductById)
    .patch(UploadFilePhoto, UpdateProduct)
    .delete(DeleteProduct)

module.exports = router