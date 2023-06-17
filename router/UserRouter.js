const express = require('express')
const router = express.Router()
const {
    UpdateUser, GetUserDetails, DeleteUser, GetAllUsers
} = require(`${__dirname}/../controllers/UserController`)
const {
    SignUp,
    Login,
    ForgotPassword,
    RestrictTo,
    Protect,
    ResetPassword,
    UpdatePassword
} = require("../controllers/AuthController");
const {DeactivateUser, ReactivateUser} = require("../controllers/UserController");

router
    .route("/")
    .get(Protect, RestrictTo("admin"), GetAllUsers)

router
    .route("/signup")
    .post(SignUp)

router
    .route("/forgot-password")
    .post(ForgotPassword)

router
    .route('/update-password')
    .patch(Protect, UpdatePassword)

router
    .route("/reset-password/:token")
    .patch(ResetPassword)

router
    .route("/login")
    .post(Login)

router
    .route('/deactivate')
    .patch(Protect, DeactivateUser)

router
    .route("/reactivate")
    .patch(ReactivateUser)

router
    .route("/:id")
    .get(Protect, RestrictTo('user'), GetUserDetails)
    .patch(Protect, RestrictTo('user'), UpdateUser)
    .delete(Protect, RestrictTo('user'), DeleteUser)

module.exports = router


