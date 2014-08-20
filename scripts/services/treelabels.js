var mongoose = require('mongoose'),
	util = require('util'),
    TreeLabel = mongoose.model('TreeLabel');

function buildReply(success, content) {
	return JSON.stringify({
		"success": success,
		"content": content
	});
}    

// { parentId : value }
exports.all = function(req, res, path, content) {
	util.puts('all labels with parentId: ' + content);
	var filter = JSON.parse(content);

	TreeLabel.find(filter, function(err, labels) {
		if(err) {
			res.end(buildReply(false, err.errors));
			util.puts(err.error);
			return;
		} 
		res.end(buildReply(true, labels));
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
			res.end(buildReply(true, label));
		};

		var labelDetails = JSON.parse(content);
		var label = new TreeLabel(labelDetails || {});
		if (label._id) {
			util.puts('updating existing label with id:' + label._id);
			var upsertData = label.toObject();
			delete upsertData._id;
			TreeLabel.update({ _id : label._id }, upsertData, {upsert: true}, handler);
		} else {
			util.puts('adding a new label with name: ' + label.name);
			label.save(handler);	
		}
					
	} catch (ex) {
		res.end(buildReply(false, "persist threw an exception"));
		return;		
	}
};

exports.delete = function(req, res, path, content) {
	var labelDetails = JSON.parse(content);
	var label = new TreeLabel(labelDetails || {});
	if (label._id) {
		TreeLabel.remove({ _id: label._id }, function (err) {
			if(err) {
				res.end(buildReply(false, err.error));
				util.puts(err.error);
				return;
			}
		  	res.end(buildReply(true, label._id));
		  	return;
		});
	} 
	res.end(buildReply(false, "no label provided"));		
	return;
};