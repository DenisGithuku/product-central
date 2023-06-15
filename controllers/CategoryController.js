const Category = require(`${__dirname}/../models/CategoryModel`)
const AppError = require(`${__dirname}/../util/AppError`)
const CatchAsync = require(`${__dirname}/../util/CatchAsync`)


exports.GetProductCategories = CatchAsync(async (req, res, next) => {
    const categories = await Category.find()
    res
        .status(200)
        .json({
            status: 'success',
            requestedAt: req.requestedAt,
            data: {
                categories
            }
        })
})

exports.AddCategory = CatchAsync(async (req, res, next) => {
    await Category.create(req.body)
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Category added successfully'
        })
})