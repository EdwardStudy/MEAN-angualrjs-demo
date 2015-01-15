
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
  http = require('http'),
  path = require('path'),
  ejs = require('ejs');

var app = module.exports = express();

var devices = require('./routes/devices');

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
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

//Create a REST based Node/MongoDB backend
//Read
app.get('/devices', devices.findAll);

//View one device
app.get('/device/:id', devices.findById);

//Add a new device
app.post('/devices', devices.add);

//Update a device
app.put('/devices/:id', devices.update);


//Delete a device
app.delete('/deivces/:id', devices.delete);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
