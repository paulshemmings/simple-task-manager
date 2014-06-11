app.controller('TasksController', function($scope, dataProvider) {
	$scope.tasks = [];

	function initialize() {
		$scope.orderPredicate = 'name';
		$scope.orderReverse = false;
		$scope.filter = {
			hidden: false
		};
		$scope.list();
	}

	$scope.list = function() {
		if ($scope.filter.status && $scope.filter.status.length > 0) {
			$scope.filter.status = parseInt($scope.filter.status);	
		}
		
		dataProvider.getTasks($scope.filter, function(data) {
			$scope.tasks = data.content;
		});
	};	

	$scope.persist = function(callback) {
		console.log("add task");
		dataProvider.persisTask($scope.task, function(data) {
			if (data.success) {
				$scope.list();	
			}
			callback(data.success);
		});
	};	

	$scope.delete = function(id) {
		dataProvider.deleteTask(id, function(data) {
			if (data.success) {
				$scope.list();	
			}
		});
	}	

	initialize();
});