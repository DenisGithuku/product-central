const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name']
    },
    category: {
        type: String,
        required: [true, 'A product must be in at least one category'],
        enum: [],
        lowercase: true
    },
    price: {
        type: Number,
        required: [true, 'A product must contain a price']
    },
    description: {
        type: String,
        minlength: [30, 'At least 30 characters required'],
        maxlength: [2000, 'Description should not exceed 2000 characters']
    },
    image: String,
    reviews: Array,
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

module.exports = ProductModel = mongoose.model('ProductModel', ProductSchema)