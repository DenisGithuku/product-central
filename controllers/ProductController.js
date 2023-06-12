const AppError = require(`${__dirname}/../util/AppError`)
const CatchAsync = require(`${__dirname}/../util/CatchAsync`)
const Product = require(`${__dirname}/../models/ProductModel`)
const multer = require('multer')
const mongoose = require("mongoose");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/products')
    },
    filename: (req, file, cb) => {
        //product-9097783405454jk5d-89888090.jpeg
        const id = new mongoose.Types.ObjectId()
        const ext = file.mimetype.split("/")[1]
        cb(null, `product-${id}-${Date.now()}.${ext}`)
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Please upload a valid image', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.UploadFilePhoto = upload.single('image')

exports.GetAllProducts = CatchAsync(async (req, res, next) => {
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

exports.AddNewProduct = CatchAsync(async (req, res, next) => {
    const productInfo = { "image": req.file.filename, ...req.body}
    await Product.create(productInfo)
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Added new product successfully'
        })
})

exports.DeleteProduct = CatchAsync(async (req, res, next) => {
    await Product.findByIdAndDelete(req.params.id)
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Delete product route'
        })
})

exports.UpdateProduct = (req, res, next) => {
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Update route'
        })
}

