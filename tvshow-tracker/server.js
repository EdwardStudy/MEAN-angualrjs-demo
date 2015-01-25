/**
 * Module dependencies
 */

var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    morgan = require('morgan'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    ejs = require('ejs'),
    mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    passport = require('passport'),
    session = require('express-session');

var app = module.exports = express();

/**
 * DB config
 *
 * */

//顺序很重要，run mongoose
var db = require('./app/models/mongodb');
//注册Model
var Show = require('./app/models/show');
var User = require('./app/models/user');
//加载路径处理模块
var shows = require('./routes/shows');
var users = require('./routes/users');
/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/public');
app.use(express.static(path.normalize(__dirname + '/..') + '/public'));

//不用template app.set('view engine', 'jade');
//直接使用html文件
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'yoyo checknow' }));
app.use(passport.initialize());
app.use(passport.session());


app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

//Handle error
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.send(500, { message: err.message });
});

//create user cookie
app.use(function(req, res, next) {
    if (req.user) {
        res.cookie('user', JSON.stringify(req.user));
    }
    next();
});

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
    app.use(errorHandler());
}

// production only
if (env === 'production') {
    // TODO
}

/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);

//Get all shows
app.get('/api/shows', shows.getAllShows);

//Get a show
app.get('/api/shows/:id', shows.getShow);

//Add a new show
app.post('/api/shows', shows.addShow);

//Auth
app.post('/api/login', passport.authenticate('local'), function(req, res) {
    res.cookie('user', JSON.stringify(req.user));
    res.send(req.user);
})

app.post('/api/signup', users.signup);

app.get('/api/logout', users.logout);

//subscription



// redirect all others to the index (HTML5 history)
app.get('*', routes.redirect);



/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

// protect our routes from unauthenticated requests.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) next();
    else res.send(401);
}