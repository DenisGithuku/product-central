const User = require(`${__dirname}/../models/UserModel`)
const AppError = require(`${__dirname}/../util/AppError`)
const CatchAsync = require(`${__dirname}/../util/CatchAsync`)

const filterBody = (userObj, ...allowedFields) => {
    const newObject = {}
    Object.keys(userObj).forEach(el => {
        if (allowedFields.includes(el)) newObject[el] = userObj[el]
    })
    return newObject
}

exports.GetAllUsers = CatchAsync(async (req, res, next) => {
    const users = await User.find()
    res
        .status(200)
        .json({
            status: 'success',
            data: {users}
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

exports.UpdateUser = CatchAsync(async (req, res, next) => {
    /*
    1. check if user sent password
     */
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError('Please use /reset-password route for password reset', 400))
    }

    /*
    2. filter unwanted fields
     */
    const userObj = filterBody(req.body, 'name', 'email')

    /*
    3. update user
     */
    const newUser = await User.findByIdAndUpdate(req.params.id, userObj, {
        new: true,
        runValidators: true
    })

    /*
    4. send response
     */
    res
        .status(200)
        .json({
            status: 'success',
            data: {newUser}
        })
})

exports.DeleteUser = CatchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Account deleted successfully'
        })
})

exports.DeactivateUser = CatchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.params.id, {active: false})
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Account deactivated'
        })
})

exports.ReactivateUser = CatchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.params.id, {active: true})
    res
        .status(200)
        .json({
            status: 'success',
            message: 'Account reactivated'
        })
})