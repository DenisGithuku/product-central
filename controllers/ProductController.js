const AppError = require(`${__dirname}/../util/AppError`)
const CatchAsync = require(`${__dirname}/../util/CatchAsync`)
const Product = require(`${__dirname}/../models/ProductModel`)
const multer = require('multer')
const {mongo} = require("mongoose");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/products')
    },
    filename: (req, file, cb) => {
        //product-9097783405454jk5d-89888090.jpeg
        const id = mongo.ObjectId()
        const ext = file.mimetype.split("/")[1]
        cb(null, `product-${id}-${Date.now()}.${ext}`)
    }
})



exports.GetAllProducts = CatchAsync( async (req, res, next) => {
    const products = await Product.find()
    res
        .status(200)
        .json({
            status: 'success',
            results: products.length,
            requestedAt: req.requestedAt,
            data: {
                products
            }
        })
})

exports.GetProductCategories = (req, res, next) => {
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Get product categories'
        })
}

exports.GetProductById = (req, res, next) => {
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Get single product by id'
        })
}

exports.AddNewProduct = CatchAsync( async (req, res, next) => {
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Add new product'
        })
})

exports.DeleteProduct = (req, res, next) => {
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Delete product route'
        })
}

exports.UpdateProduct = (req, res, next) => {
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Update route'
        })
}

