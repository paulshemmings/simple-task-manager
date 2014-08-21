app.controller('TreeNotesController', function($scope, dataProvider, noteDataProvider) {

	$scope.TreeView = {
		Cache : {},
		Store : [],
		Selected : {
			Node : null,
			Path : ""
		}
	};

	$scope.NotesView = {
		Store : [],
		Selected : null
	}	

	function initialize() {
		$scope.TreeView.list({'top': true});
	}

	function createTopTreeLabelNode() {
		$scope.TreeView.persist(null, {
			name : 'top'
		}, function() {
			console.log('created top node');
		});
	}

	function addTreeLabelToModel(treeLabel) {
		// add sub nodes
		var extendedLabel = $.extend(treeLabel, { nodes: [] });
		// store in cache
		$scope.TreeView.Cache[treeLabel._id] = extendedLabel;
		// add to top if top
		// otherwise add to sub nodes of parent
		if(treeLabel.top) {
			$scope.TreeView.Store.push(extendedLabel);
		} else {
			$scope.TreeView.Cache[extendedLabel.parentId].nodes.push(extendedLabel);
		}
	}

	function generateLabelPath(label) {
		var node = label,
			path = label.name;
		while($scope.TreeView.Cache[node.parentId]) {
			node = $scope.TreeView.Cache[node.parentId];
			path = node.name + "/" + path;
		}
		return path;
	}

	$scope.TreeView.select = function(label) {
		// do nothing if already selected
		if($scope.TreeView.Selected.Node == label) return;

		// select this node
		$scope.TreeView.Selected.Node = label;

		// unselect any selected note 
		// $scope.NotesView.Selected = null;

		// clear the nodes
		label.nodes.length = 0;

		// rebuild nodes
		$scope.TreeView.list({parentId : label._id});

		// rebuild the current path
		$scope.TreeView.Selected.Path = generateLabelPath(label);

		// show related notes
		$scope.NotesView.list($scope.TreeView.Selected.Path);
	}

	$scope.NotesView.select = function(note) {
		// do nothing if already selected
		if($scope.NotesView.Selected == note) return;

		// select this note
		$scope.NotesView.Selected = note;
	}

	$scope.NotesView.addLabel = function() {
		var label = $scope.TreeView.Selected,
			note = $scope.NotesView.Selected;

		if(label.Path.length > 0) {		
			if (note) {
				if ($.inArray(label.Path, note.labels) -1) {
					note.labels.push(label.Path);
					$scope.NotesView.persist(note, function(response) {
						if(response.success) {
							console.log('added label to note');
						}
					});				
				}
			}
		}
	}

	$scope.NotesView.removeLabel = function(label) {
		var note = $scope.NotesView.Selected;
		if (note) {
			if ($.inArray(label.Path, note.labels) != -1) {
				note.labels.splice( $.inArray(label, note.labels), 1 );
				$scope.NotesView.persist(note, function(response) {
					if(response.success) {
						console.log('removed label from note');
					}
				});				
			}
		}
	}

	$scope.TreeView.create = function() {
		if($scope.TreeView.Selected.Node) {
			$scope.TreeView.persist($scope.TreeView.Selected.Node, {
				name : "[new label]"
			}, function(response) {
				if(response.success) {
					addTreeLabelToModel(response.content);
				}
			});
		}		
	}

	$scope.NotesView.create = function() {
		if($scope.TreeView.Selected.Node) {
			$scope.NotesView.persist({
				name : 'new note',
				labels : [$scope.TreeView.Selected.Path],
				content : '[enter your note here]'
			}, function(response) {
				if(response.success) {
					$scope.NotesView.list($scope.TreeView.Selected.Path);
				}
			});
		}
	}	

	$scope.TreeView.update = function() {
		if($scope.TreeView.Selected.Node) {
			var label = $scope.TreeView.Selected.Node,
				parent = $scope.TreeView.Cache[label.parentId];

			$scope.TreeView.persist(parent, label, function() {
				console.log('label updated');
			});
		}
	}

	$scope.NotesView.update = function() {
		if($scope.NotesView.Selected) {
			$scope.NotesView.persist($scope.NotesView.Selected, function() {
				console.log('note updated');
			});
		}
	}	

	$scope.TreeView.delete = function() {
		if($scope.TreeView.Selected.Node) {
			var label = $scope.TreeView.Selected.Node,
				parent = $scope.TreeView.Cache[label.parentId],
				index = -1;

			if(parent) {
				index = parent.nodes.indexOf(label);
			}

			dataProvider.deleteTreeLabel(label, function(response) {
				console.log('deleted tree label:', label);
				// remove from cache
				$scope.TreeView.Cache[label._id] = null;
				// remove from parent nodes list
				if(index > -1) {
					parent.nodes.splice(index,1);
				}
				// unselect
				$scope.TreeView.Selected.Node = null;
			});
		}
	}

	$scope.NotesView.delete = function() {
		if($scope.NotesView.Selected) {
			noteDataProvider.deleteNote($scope.NotesView.Selected, function(response) {
				console.log('note deleted');

				// remove from the notes list
				$scope.NotesView.Store.splice( $.inArray($scope.NotesView.Selected, $scope.NotesView.Store), 1 );

				// unselect
				$scope.NotesView.Selected = null;
			});
		}
	}

	$scope.TreeView.list = function(filter) {
		dataProvider.getTreeLabels(filter, function(response) {
			if(response.success) {
				if(response.content.length == 0) {
					console.log('trying to create top node');
					// return createTopTreeLabelNode();
				}
				response.content.forEach(function(treeLabel) {
					addTreeLabelToModel(treeLabel);					
				})
			}
		});
	};	

	$scope.NotesView.list = function(filter) {
		$scope.NotesView.Store.length = 0;
		noteDataProvider.getNotes(filter, function(response) {
			if(response.success) {
				if(response.content.length == 0) {
					console.log('trying to create note');
					// return createTopTreeLabelNode();
				}
				response.content.forEach(function(note) {					
					$scope.NotesView.Store.push(note);
				})
			}
		});
	};		

	$scope.TreeView.persist = function(parent, treeLabel, callback) {
		console.log("add tree label", treeLabel);
		dataProvider.persistTreeLabel({
			_id: treeLabel._id,
			name: treeLabel.name,
			parentId : parent ? parent._id : null,
			top : parent ? false : true
		}, function(response) {
			callback(response);
		});
	};	

	$scope.NotesView.persist = function(note, callback) {
		console.log("add note", note);
		noteDataProvider.persistNote({
				_id: note._id,
				name: note.name,
				labels: note.labels,
				content: note.content
		}, function(response) {
			callback(response);
		});
	};	

	initialize();
});




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
