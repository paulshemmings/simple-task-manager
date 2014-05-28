app.service('dataProvider', function($http) {

	this.getTasks = function(filter, callback) {

		for(property in filter) {
			if(filter[property] === "") {
				delete filter[property];
			}
		}		

		console.log('list' + JSON.stringify(filter));

		$http.post('/services/tasks/all', filter)
			.success(function(data, status, headers, config) {
			    callback({ success: data.success, content: data.content });
			})
			.error(function(data, status, headers, config) {
				callback({ success: false, content: [], status: 'failed to load tasks'});
			});
	};

	this.persisTask = function(newTask, callback) {

		console.log("add " + JSON.stringify(newTask));

		$http.post('/services/tasks/persist', newTask)
			.success(function(data, status, headers, config) {
			    callback({ success: data.success, content: data.content });
			})
			.error(function(data, status, headers, config) {
				callback({ success: false, content: [], status: 'failed to add task'});
			});
	};	

	this.deleteTask = function(id, callback) {

		console.log("delete task with _id = " + id);

		$http.post('/services/tasks/delete', id)
			.success(function(data, status, headere, config) {
				callback({ success: data.success, content: data.content });
			})		
			.error(function(data, status, headers, config) {
				callback({ success: false, content: [], status: 'failed to delete task'});
			});
	}	

});