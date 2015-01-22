
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  morgan = require('morgan'),
  routes = require('./routes'),
  api = require('./routes/api'),
  devices = require('./routes/devices');
  http = require('http'),
  path = require('path'),
  ejs = require('ejs');

var app = module.exports = express();


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
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

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

// Read
app.get('/devices', devices.findAll);

// View one device
app.get('/device/:id', devices.findById);

//add new device
app.post('/devices', devices.add);

//delete the device
app.delete('/devices/:id', devices.delete);

//update the device
app.put('/devices/:id', devices.update);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
