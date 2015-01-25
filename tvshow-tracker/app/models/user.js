/**
 * app/models/user.js
 * user model
 */

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String }
});

/**
 * Pre-save hook for password validation and hashing
 */

//Use mongoose middleware -- serial pre
userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

//Use mongoose middleware instance method for password validation
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Build the user model
mongoose.model( 'User', userSchema );