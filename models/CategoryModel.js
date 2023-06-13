const mongoose = require('mongoose')
const slugify = require('slugify')

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A category must contain a name'],
        maxlength: 30
    },
    slug: String
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

CategorySchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true})
    next()
})

module.exports = CategoryModel = mongoose.model('Category', CategorySchema)