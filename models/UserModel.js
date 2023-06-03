const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name']
    },
    role: {
        type: String,
        required: [true, 'You must provide a role'],
        enum: ['user', 'admin']
    },
    email: {
        type: String,
        validate: validator.isEmail,
        required: [true, 'You must provide an email address']
    },
    password: {
        type: String,
        required: [true, "Password required"],
        minlength: 6,
    },
    confirmPassword: {
        type: String,
        required: [true, 'Password confirmation required'],
        validate: {
            validator: function (value) {
                return value === this.confirmPassword
            },
            message: "Passwords do not match"
        }
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

module.exports =  User = mongoose.model('User', UserSchema)

