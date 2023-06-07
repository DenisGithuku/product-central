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
    await Product.create(req.body)
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Successfully added new product'
        })
})

exports.DeleteProduct = CatchAsync(async (req, res, next) => {
    await Product.findByIdAndDelete(req.params.id)
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Product deleted successfully'
        })
})

exports.UpdateProduct = CatchAsync(async (req, res, next) => {
    await Product.findByIdAndUpdate(req.params.id, req.body)
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Update route'
        })
})

