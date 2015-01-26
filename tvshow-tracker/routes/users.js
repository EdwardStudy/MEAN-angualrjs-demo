var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = mongoose.model('User');

exports.signup =  function(req, res, next) {
    var user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save(function(err) {
        if (err) return next(err);
        res.send(200);
    });
};

exports.logout = function(req, res, next) {
    req.logout();
    res.send(200);
};