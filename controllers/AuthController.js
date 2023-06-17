const User = require(`${__dirname}/../models/UserModel`)
const AppError = require(`${__dirname}/../util/AppError`)
const CatchAsync = require(`${__dirname}/../util/CatchAsync`)
const jwt = require("jsonwebtoken");
const {promisify} = require('util')
const EmailHandler = require(`${__dirname}/../util/EmailUtil`)
const crypto = require('crypto')

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
    const message = `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Our Website</title>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .email-container {
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h1>Welcome to Product Central!</h1>
    <p>Dear ${newUser.name.split(' ')[0]},</p>
    <p>Thank you for joining <b style="color: cornflowerblue">Product Central</b>. We are excited to have you as a member of our community.</p>
    <p>With our website, you can:</p>
    <ul type="none">
      <li>Explore a wide range of products/services</li>
      <li>Connect with like-minded individuals</li>
      <li>Participate in engaging discussions</li>
      <li>Stay up-to-date with the latest news and updates</li>
    </ul>
    <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
    <p>Once again, welcome aboard!</p>
    <p>Best regards,</p>
    <p>The Product Central Team</p>
  </div>
</body>
</html>
    `
    await new EmailHandler({
        to: newUser.email,
        subject: 'WELCOME TO PRODUCT CENTRAL',
        message: message
    }).SendMail()
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

exports.ForgotPassword = CatchAsync(async (req, res, next) => {
    /*
    1. Get user with email
     */
    const user = await User.findOne({email: req.body.email})

    if (!user) {
        return next(new AppError('There is no user with such an email address', 404))
    }

    /*
    2. Generate random token
     */
    const resetToken = user.GeneratePasswordResetToken()
    await user.save({validateBeforeSave: false})

    /*
    send password reset email
     */
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`
    const message = `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset</title>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      opacity: 0.7
    }

    .email-container {
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h1>Password Reset</h1>
    <p>Dear user,</p>
    <p>We have received a request to reset your password. To proceed with the password reset, please use the following code:</p>
    <h2>Your Password Reset Token: <span style="opacity: 1;">${resetToken}</span></h2>
    <p>If you didn't request a password reset, please ignore this email.</p>
    <p>Thank you,</p>
    <p>The Product Central Team</p>
  </div>
</body>
</html>
    `

    try {
        await new EmailHandler({
            to: user.email,
            subject: 'PASSWORD RESET. VALID FOR (10) MINUTES',
            message
        }).SendMail()
        res
            .status(200)
            .json({
                status: 'success',
                message: 'Password reset token sent to mail'
            })
    } catch (e) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiresAt = undefined
        await user.save({validateBeforeSave: false})
        console.log(e)
        return next(
            new AppError('There was an error sending email. Please try again later', 500)
        )
    }
})

exports.ResetPassword = CatchAsync(async (req, res, next) => {
    /*
    Get user based on token
     */
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetTokenExpiresAt: {$gt: Date.now()}})

    if (!user) {
        return next(
            new AppError('Token invalid or expired', 400)
        )
    }

    /*
    save updated password
     */
    user.password = req.body.password
    user.confirmPassword = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetTokenExpiresAt = undefined
    await user.save()

    /*
    Login user and send jwt
     */
    CreateSendToken(user, 200, res)
})

exports.UpdatePassword = CatchAsync(async (req, res, next) => {
    /*
    Get user from db
     */
    const user = await User.find(req.user.id).select("+password")

    /*
    check if posted password is correct
     */
    if (!await User.CheckPassword(req.body.password, user.password)) {
        return next(
            new AppError("Wrong password. Please try again", 400)
        )
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    /*
    Send new token
     */
    CreateSendToken(user, 200, res)
})