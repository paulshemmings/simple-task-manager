var mongoose = require('mongoose'),
	util = require('util'),
    Note = mongoose.model('Note');

function buildReply(success, content) {
	return JSON.stringify({
		"success": success,
		"content": content
	});
}    

exports.all = function(req, res, path, content) {
	util.puts('all Notes which contain label: ' + content);
	var filter = { labels: {$in: [content] }};

	Note.find(filter, function(err, notes) {
		if(err) {
			res.end(buildReply(false, err.errors));
			util.puts(err.error);
			return;
		} 
		res.end(buildReply(true, notes));
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
			res.end(buildReply(true, note));
		};

		var noteDetails = JSON.parse(content);
		var note = new	Note(noteDetails || {});
		if (note._id) {
			var upsertData = note.toObject();
			delete upsertData._id;
			Note.update({ _id : Note._id }, upsertData, {upsert: true}, handler);
		} else {
			note.save(handler);	
		}
					
	} catch (ex) {
		res.end(buildReply(false, "persist threw an exception"));
		return;		
	}
};

exports.delete = function(req, res, path, content) {
	var noteDetails = JSON.parse(content);
	var note = new	Note(noteDetails || {});
	if (note._id) {
		Note.remove({ _id: note._id }, function (err) {
			if(err) {
				res.end(buildReply(false, err.error));
				util.puts(err.error);
				return;
			}
		  	res.end(buildReply(true, note._id));
		  	return;
		});
	} 
	res.end(buildReply(false, "no note provided"));		
	return;
};