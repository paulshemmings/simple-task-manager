app.service('dataProvider', function($http) {

	this.getTreeLabels = function(filter, callback) {

		for(property in filter) {
			if(filter[property] === "") {
				delete filter[property];
			}
		}		

		console.log('list' + JSON.stringify(filter));

		$http.post('/services/treelabels/all', filter)
			.success(function(data, status, headers, config) {
			    callback({ success: data.success, content: data.content });
			})
			.error(function(data, status, headers, config) {
				callback({ success: false, content: [], status: 'failed to load tree label'});
			});
	};

	this.persistTreeLabel = function(newLabel, callback) {

		console.log("add " + JSON.stringify(newLabel));

		$http.post('/services/treelabels/persist', newLabel)
			.success(function(data, status, headers, config) {
			    callback({ success: data.success, content: data.content });
			})
			.error(function(data, status, headers, config) {
				callback({ success: false, content: [], status: 'failed to add tree label'});
			});
	};	

	this.deleteTreeLabel = function(treeLabel, callback) {

		console.log("delete tree label", treeLabel);

		$http.post('/services/treelabels/delete', { _id : treeLabel._id })
			.success(function(data, status, headere, config) {
				callback({ success: data.success, content: data.content });
			})		
			.error(function(data, status, headers, config) {
				callback({ success: false, content: [], status: 'failed to delete tree label'});
			});
	};

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
	};

	this.getTopLabel = function(callback) {

		console.log('get label (only one)');

		$http.post('/services/labels/list')
			.success(function(data, status, headere, config) {
				callback({ success: data.success, content: data.content });
			})		
			.error(function(data, status, headers, config) {
				callback({ success: false, content: [], status: 'failed to list labels with path:' + path});
			});		
	};

	this.persistLabel = function(label, callback) {

		console.log("persist " + JSON.stringify(label));

		$http.post('/services/labels/persist', label)			
			.success(function(data, status, headers, config) {
		    	callback({ success: data.success, content: data.content });
			})
			.error(function(data, status, headers, config) {
				callback({ success: false, content: [], status: 'failed to add label'});
			});
	};	

	this.deleteLabel = function(label, callback) {

		console.log("delete label ", label);

		$http.post('/services/labels/delete', {_id:label._id})
			.success(function(data, status, headere, config) {
				callback({ success: data.success, content: data.content });
			})		
			.error(function(data, status, headers, config) {
				callback({ success: false, content: [], status: 'failed to delete label'});
			});
	};	

});