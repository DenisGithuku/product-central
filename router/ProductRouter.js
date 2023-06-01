const express = require('express')
const router = express.Router()
const {
    GetAllProducts,
    GetProductById,
    AddNewProduct,
    GetProductCategories,
    UpdateProduct,
    DeleteProduct
} = require(`${__dirname}/../controllers/ProductController`)


router
    .route("/categories")
    .get(GetProductCategories)

router
    .route("/")
    .get(GetAllProducts)
    .post(AddNewProduct)

router
    .route("/:id")
    .get(GetProductById)
    .patch(UpdateProduct)
    .delete(DeleteProduct)

module.exports = router