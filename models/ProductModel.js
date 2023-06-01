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
}, {
    toJSON: true,
    toObject: true
})

module.exports = Product = mongoose.model('Product', ProductSchema)