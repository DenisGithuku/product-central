const mongoose = require('mongoose')
const slugify = require('slugify')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name']
    },
    inStock: {
        type: Boolean,
        default: true
    },
    category:
        {
            type: mongoose.Schema.ObjectId,
            required: [true, 'A product must be in at least one category'],
            ref: 'Category'
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
    reviews: [mongoose.Schema.ObjectId],
    rating: {
        type: Number,
        max: [5.0, 'Rating can be no more than 5.0'],
        min: [1.0, 'Rating has to be at least 1.0'],
        required: [true, 'Product must have a rating']
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

ProductSchema.index({price: 1, rating: -1})
ProductSchema.index({category: 1})

ProductSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category',
        select: '-__v'
    })
    next()
})

ProductSchema.pre(/^find/, function (next) {
    this.start = Date.now()
    next()
})

ProductSchema.post(/^find/, function (docs, next) {
    const latency = Date.now() - this.start
    console.log(`Query took: ${latency} milliseconds`)
    next()
})

module.exports = Product = mongoose.model('Product', ProductSchema)