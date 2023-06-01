const Review = require(`${__dirname}/../models/ReviewModel`)
const CatchAsync = require(`${__dirname}/../util/CatchAsync`)

exports.GetAllReviews = CatchAsync(async (req, res, next) => {
    const reviews = await Review.find()

    res
        .status(200)
        .json({
            status: 'success',
            data: {
                reviews
            }
        })
})

exports.CreateReview = CatchAsync( async (req, res, next) => {
    if (!req.user.id) {
        return next("You must be logged in to write a review")
    }
    await Review.create(req.body)
    res
        .status(201)
        .json({
            status: 'success',
            message: "Review added successfully"
        })
})