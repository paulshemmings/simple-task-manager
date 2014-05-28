var mongoose = require('mongoose'),
	util = require('util'),
    Task = mongoose.model('Task');

function buildReply(success, content) {
	return JSON.stringify({
		"success": success,
		"content": content
	});
}    

exports.all = function(req, res, path, content) {
	util.puts('all tasks matching filter ' + content);
	var filter = JSON.parse(content);

	for(property in filter) {
		if(typeof filter[property] == "string") {
			filter[property] = new RegExp(filter[property]);
		}
	}	

	Task.find(filter, function(err, tasks) {
		if(err) {
			res.end(buildReply(false, err.errors));
			util.puts(err.error);
			return;
		} 
		res.end(buildReply(true, tasks));
	});	
};

exports.persist = function(req, res, path, content) {
	try {

		function handler(err) {
			if(err) {
				res.end(err.errors);
				util.puts(err.error);
				return;
			}
			res.end(buildReply(true, task));
		};

		var taskDetails = JSON.parse(content);
		var task = new Task(taskDetails || {});
		if (task._id) {
			var upsertData = task.toObject();
			delete upsertData._id;
			Task.update({ _id : task._id }, upsertData, {upsert: true}, handler);
		} else {
			task.save(handler);	
		}
					
	} catch (ex) {
		res.end(buildReply(false, "persist threw an exception"));
		return;		
	}
};

exports.delete = function(req, res, path, content) {
	var taskDetails = JSON.parse(content);
	var task = new Task(taskDetails || {});
	if (task._id) {
		Task.remove({ _id: task._id }, function (err) {
			if(err) {
				res.end(buildReply(false, err.error));
				util.puts(err.error);
				return;
			}
		  	res.end(buildReply(true, task._id));
		  	return;
		});
	} 
	res.end(buildReply(false, "no task provided"));		
	return;
};