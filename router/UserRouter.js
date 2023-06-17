const express = require('express')
const router = express.Router()
const {
    RegisterUser, UpdateUser, GetUserDetails, DeleteUser
} = require(`${__dirname}/../controllers/UserController`)

router
    .route("/")
    .post(RegisterUser)

router
    .route("/:id")
    .get(GetUserDetails)
    .patch(UpdateUser)
    .delete(DeleteUser)

module.exports = router


