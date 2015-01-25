var mongoose = require('mongoose');
var db = 'mongodb://localhost/tv-tracker';

mongoose.connect(db);

//log messages to the console
mongoose.connection.on('connected', function(){
	console.log('Mongoose connected to ' + db);
});

mongoose.connection.on('error', function(err){
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function(){
	console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('Mongoose disconnected through app termination');
		process.exit(0);
	});
});

exports.mongoose = mongoose;