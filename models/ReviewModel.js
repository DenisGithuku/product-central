const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'A review must contain a description']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    },
    rating: {
        type: Number,
        default: 1.0,
        min: [1.0, 'Rating must not be less than 1.0'],
        max: [5.0, 'Rating must not exceed 5.0']
    }
}, {
    toJSON: true,
    toObject: true
})

module.exports = Review = mongoose.model('Review', ReviewSchema)