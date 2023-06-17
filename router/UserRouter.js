const express = require('express')
const router = express.Router()
const {
    UpdateUser, GetUserDetails, DeleteUser, GetAllUsers
} = require(`${__dirname}/../controllers/UserController`)
const {SignUp, Login} = require("../controllers/AuthController");
const {RestrictTo, Protect} = require(`${__dirname}/../controllers/AuthController`)

router
    .route("/")
    .get(Protect, RestrictTo("admin"), GetAllUsers)

router
    .route("/signup")
    .post(SignUp)
router
    .route("/login")
    .post(Login)

router
    .route("/:id")
    .get(Protect, RestrictTo('user'), GetUserDetails)
    .patch(Protect, RestrictTo('user'), UpdateUser)
    .delete(Protect, RestrictTo('user'), DeleteUser)

module.exports = router


