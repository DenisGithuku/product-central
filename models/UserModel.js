const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name']
    },
    role: {
        type: String,
        required: [true, 'You must provide a role'],
        enum: ['user', 'admin'],
        default: 'user'
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
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
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Password confirmation required'],
        validate: {
            validator: function (value) {
                return value === this.password
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
    /*
    run on password modify onlu
     */
    if (!this.isModified('password')) return next()

    /*create hash with cost 12 */

    this.password = await bcrypt.hash(this.password, 12)

    /* don't persist confirm */
    this.confirmPassword = undefined;
    next()
})

UserSchema.pre('save', function(next) {
    // skip if password is not modified or document not new
    if (!this.isModified('password') || this.isNew) return next()
    this.passwordChangedAt = Date.now() - 1000
    next()
})

UserSchema.pre(/^find/, function (next) {
    this.find({active: {$ne: false}})
    next()
})

UserSchema.methods.CheckPassword = (candidatePassword, userPassword) => {
    return bcrypt.compare(candidatePassword, userPassword)
}

UserSchema.methods.PasswordChangedAfter = function (jwtTimestamp) {
    if (this.passwordChangedAt) {
        const passwordChangeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return passwordChangeTimestamp > jwtTimestamp
    }
    /* password never changed */
    return false
}

UserSchema.methods.GeneratePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256')
        .update(resetToken)
        .digest('hex')
    this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000 // expire after 10 minutes
    return resetToken
}

module.exports = User = mongoose.model('User', UserSchema)

