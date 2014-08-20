app.service('noteDataProvider', function($http) {

	this.getNotes = function(filter, callback) {

		console.log('list: ' + JSON.stringify(filter));

		$http.post('/services/notes/all', filter)
			.success(function(data, status, headers, config) {
			    callback({ success: data.success, content: data.content });
			})
			.error(function(data, status, headers, config) {
				callback({ success: false, content: [], status: 'failed to load tree label'});
			});
	};

	this.persistNote = function(note, callback) {

		console.log("add " + JSON.stringify(note));

		$http.post('/services/notes/persist', note)
			.success(function(data, status, headers, config) {
			    callback({ success: data.success, content: data.content });
			})
			.error(function(data, status, headers, config) {
				callback({ success: false, content: [], status: 'failed to add tree label'});
			});
	};	

	this.deleteNote = function(note, callback) {

		console.log("delete note", note);

		$http.post('/services/notes/delete', { _id : note._id })
			.success(function(data, status, headere, config) {
				callback({ success: data.success, content: data.content });
			})		
			.error(function(data, status, headers, config) {
				callback({ success: false, content: [], status: 'failed to delete tree label'});
			});
	};
});