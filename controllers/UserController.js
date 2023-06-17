const User = require(`${__dirname}/../models/UserModel`)
const AppError = require(`${__dirname}/../util/AppError`)
const CatchAsync = require(`${__dirname}/../util/CatchAsync`)

exports.RegisterUser = CatchAsync(async (req, res, next) => {
    await User.create(req.body)
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Account created successfully'
        })
})

exports.GetUserDetails = CatchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    res
        .status(200)
        .json({
            status: 'success',
            data: {user}
        })
})

exports.DeactivateAccount = CatchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.params.id, {active: false})
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Account deactivated successfully'
        })
})

exports.DeleteAccount = CatchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Account deleted successfully'
        })
})