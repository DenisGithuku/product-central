const AppError = require(`${__dirname}/../util/AppError`)
const CatchAsync = require(`${__dirname}/../util/CatchAsync`)
const Product = require(`${__dirname}/../models/ProductModel`)

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

exports.GetProductById = CatchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    res
        .status(200)
        .json({
            status: 'success',
            data: {
                product
            }
        })
})

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

