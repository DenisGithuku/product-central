const AppError = require(`${__dirname}/../util/AppError`)
const CatchAsync = require(`${__dirname}/../util/CatchAsync`)
const Product = require(`${__dirname}/../models/ProductModel`)
const Category = require(`${__dirname}/../models/CategoryModel`)
const ApiFeatures = require(`${__dirname}/../util/ApiFeatures`)
const multer = require('multer')
const mongoose = require("mongoose");
const sharp = require('sharp')

const filterObject = (filterBody, ...allowedFields) => {
    const newObject = {}
    Object.keys(filterBody).forEach(field => {
        if (allowedFields.includes(field)) {
            newObject[field] = filterBody[field]
        }
    })

    return newObject
}

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/products')
//     },
//     filename: (req, file, cb) => {
//         //product-9097783405454jk5d-89888090.jpeg
//         const id = new mongoose.Types.ObjectId()
//         const ext = file.mimetype.split("/")[1]
//         cb(null, `product-${id}-${Date.now()}.${ext}`)
//     }
// })

// set save location to buffer
const multerStorage = multer.memoryStorage()

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

exports.UploadProductPhoto = upload.single('image')

exports.ResizeProductPhoto = CatchAsync(async (req, res, next) => {
    if (!req.file) return next()

    // random id for each photo
    const id = new mongoose.Types.ObjectId()

    req.file.filename = `product-${id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/img/products/${req.file.filename}`) //product-9097783405454jk5d-89888090.jpeg

    next()
})

exports.GetAllProducts = CatchAsync(async (req, res, next) => {
    if (req.query.category) {
        // map to id to category string
        const category = await Category.find({slug: req.query.category})
        req.query.category = category[0].id
    }
    const features = new ApiFeatures(Product.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
    const products = await features.query
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


exports.GetProductById = CatchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    res
        .status(200)
        .json({
            status: 'success',
            requestedAt: req.requestedAt,
            data: {
                product
            }
        })
})

exports.AddNewProduct = CatchAsync(async (req, res, next) => {
    const productInfo = {"image": req.file.filename, ...req.body}
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

exports.UpdateProduct = CatchAsync(async (req, res, next) => {
    //restrict updatable fields
    const filteredBody = filterObject(req.body, 'name', 'inStock', 'price', 'description')
    if (req.file) filteredBody.image = req.file.filename
    await Product.findByIdAndUpdate(req.params.id, filteredBody)
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Product updated successfully'
        })
})
