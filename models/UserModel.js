const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const net = require("net");

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
        validate: [validator.isEmail, "Please use a valid email address"],
        required: [true, 'You must provide an email address']
    },
    active: {
        type: Boolean,
        default: true
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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpiresAt: Date
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

UserSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined;
    next()
})

UserSchema.pre('save', function(next) {
    // skip if password is not modified or document not new
    if (!this.isModified('password') || this.isNew) return next()
    this.passwordChangedAt = Date.now() - 1000
    next()
})

UserSchema.pre(/^find/, function(next) {
    this.select({active: {$ne: false}})
    next()
})

UserSchema.methods.CheckPassword = (candidatePassword, userPassword) => {
    return bcrypt.compare(candidatePassword, userPassword)
}
module.exports =  User = mongoose.model('User', UserSchema)

