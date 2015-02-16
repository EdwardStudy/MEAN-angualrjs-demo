//依赖
var express = require('express');
//request logging
var morgan = require('morgan');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var app = express();

var port = process.env.Port || 3001;
var User = require('./models/User');

//DB
//mongoose.connect(process.env.MONGO_URL);
mongoose.connect('mongodb://localhost/token-auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    //允许all domains，POST GET method， headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.post('/authenticate', function(req, res){
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user){
        if(err){
            res.json({
                type: false,
                data: "Error occured:" + err
            });
        }else{
            if(user){
                res.json({
                    type: true,
                    data: user,
                    token: user.token
                });
            }else{
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });
            }
        }
    });
});

app.post('/signin', function(req, res){
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user){
        if(err){
            res.json({
                type: false,
                data: "Error occured:" + err
            });
        }else{
            if(user){
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            }else{
                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                userModel.save(function(err, user){
                    user.token = jwt.sign(user, process.env.JWT_SECRET);
                    user.save(function(err, user1){
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                });
            }
        }
    });
});

//受限内容
app.get('/me', ensureAuthorized, function(req, res){
    User.findOne({token: req.token}, function(err, user){
        if(err){
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        }else{
            res.json({
                type: true,
                data: user
            });
        }
    });
});

function ensureAuthorized(req, res, next) {
    var bearerToken;
    //抓取authorization header
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        //continue request
        next();
    } else {
        res.send(403);
    }
}

process.on('uncaughtException', function(err) {
    console.log(err);
});

// Start Server
app.listen(port, function () {
    console.log( "Express server listening on port " + port);
});