const express = require('express')
const {GetAllReviews, CreateReview} = require(`${__dirname}/../controllers/ReviewController`);

const router = express.Router()

router
    .route("/")
    .get(GetAllReviews)
    .post(CreateReview)

module.exports = router