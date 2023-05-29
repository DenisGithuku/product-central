exports.GetAllProducts = (req, res, next) => {
    res
        .status(200)
        .json({
            status: 'success',
            message: 'All Products appear here'
        })
}