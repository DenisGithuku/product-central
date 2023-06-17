const User = require(`${__dirname}/../models/UserModel`)
const AppError = require(`${__dirname}/../util/AppError`)
const CatchAsync = require(`${__dirname}/../util/CatchAsync`)
const jwt = require("jsonwebtoken");
const {promisify} = require('util')

const CreateJTWToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const CreateSendToken = (user, statusCode, res) => {
    const token = CreateJTWToken(user._id)
    const status = `${statusCode}`.startsWith('2') ? 'success' : 'fail'
    res
        .status(statusCode)
        .json({
            status,
            token,
            data: {
                user
            }
        })
}

exports.SignUp = CatchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })
    if (!newUser) {
        return next(new AppError('Could not register. Please try again', 400))
    }
    CreateSendToken(newUser, 200, res)
})

exports.Login = CatchAsync(async (req, res, next) => {
    const {email, password} = req.body
    /* check if user exists.
       re-select password field
     */
    const user = await User.findOne({email}).select("+password")

    /*
        check if user is present and password matches
     */
    if (!user || !(await user.CheckPassword(password, user.password))) {
        return next(new AppError('Invalid email or password', 401))
    }

    /*
        user present and password okay
     */
    CreateSendToken(user, 200, res)
})

exports.Protect = CatchAsync(async (req, res, next) => {
    /*
    read token
     */
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    /*
    send unauthorized message if toke missing
     */
    if (!token) {
        return next(new AppError("Unauthorized access. Please provide an access token", 401))
    }

    /*
    verify the validity of jwt
     */
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    /*
    check if user exist
     */
    const freshUser = await User.findById(decoded.id)
    if (!freshUser) {
        return next(new AppError('User belonging to that email does not exist', 401))
    }

    /*
    check user password not modified
     */
    if (freshUser.PasswordChangedAfter(decoded.iat)) {
        return next(new AppError('Password was recently changed', 401))
    }

    /* grant access to the user */
    req.user = freshUser
    next()
})

exports.RestrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You are not authorized to access this route', 401))
        }

        next()
    }
}