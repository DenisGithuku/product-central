const AppError = require(`${__dirname}/../util/AppError`)
const CatchAsync = require(`${__dirname}/../util/CatchAsync`)
const ProductModel = require(`${__dirname}/../models/ProductModel`)

exports.GetAllProducts = (req, res, next) => {
    res
        .status(200)
        .json({
            status: 'success',
            message: 'All Products appear here'
        })
}

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

