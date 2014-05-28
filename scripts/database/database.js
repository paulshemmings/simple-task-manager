var mongoose = require('mongoose'),
	util = require('util'),
	fs = require('fs');

// bootstrap connections.

util.puts('connect to db');
var db = mongoose.connect('mongodb://localhost/tasks-db');

// bootstrap modules 

var models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function(file) {
	util.puts('load model ' + file);
    require(models_path + '/' + file);
});	



