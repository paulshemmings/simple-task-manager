var TaskPageScripts = {

	getElementScope : function (elementId, callback) {
		var element = document.getElementById(elementId);
		angular.element(element).scope().$apply(callback);
	},

	captureContentEditableChanges : function(topElement) {
		$(topElement)
			.on('focus', '[contenteditable]', function() {
			    var $this = $(this);
			    $this.data('before', $this.html());
			    return $this;
			})
			.on('blur paste', '[contenteditable]', function() {
				// could also look for "keyup input"
			    var $this = $(this);
			    if ($this.data('before') !== $this.html()) {
			        $this.data('before', $this.html());
			        $this.trigger('change');
			    }
			    return $this;
			});
	},

	buildTaskModel :function (container) {
		return {
	        '_id': $(container).data('task-id'),
	        'status': $(container).find(':input[type="radio"]:checked').val(),
	        'name': $(container).find('.task-name').text(),
	        'blockers': $(container).find('.task-blockers').text(),
	        'solutions': $(container).find('.task-solutions').text(),
	        'hidden' : false
		};
	},

	validateModel: function(model) {
		return model.status != undefined 
			&& model.name != null
			&& model.name.trim().length > 0;
	},

	getTaskContainer : function (event) {
		return $(event.target).closest('tr');
	},

	getChangedRows : function() {
		return $('tr.changed');
	},

	clearAddRow: function() {
		var editables = $('#new-task-row').find("[contenteditable]");
		$.each(editables, function() {
			$(this).text('');
		});
	},

	callTaskControllerPersist : function (model) {
		var self = TaskPageScripts;
		// in need of refactoring using promises.
		this.getElementScope('task-view', function(scope) {
			scope.task = model;
			scope.persist(function(success) {
				if (success) {
					self.clearAddRow();
				}
			});
		});
	},

	handlePersistTaskRequest : function(event) {
		var container = this.getTaskContainer(event),
			model = this.buildTaskModel(container),
			valid = this.validateModel(model);

		if (valid) {
			this.callTaskControllerPersist(model);			
		}					
	},

	handleTextChange : function(event) {
		var container = this.getTaskContainer(event),
			model = this.buildTaskModel(container),
			valid = this.validateModel(model);

		container.toggleClass('changed', true);
		container.toggleClass('invalid', !valid);
	},

	handleFilterFocus : function(event) {
		$(event.target).find(':input').focus();
	},

	handleToggleFilterRow : function(even) {
		var filterRow = $('.task-filter-row'),
			hidden = $(filterRow).hasClass('hidden');
		filterRow.toggleClass('hidden', !hidden);			
	},

	handleToggleAddRow : function(even) {
		var filterRow = $('#new-task-row'),
			hidden = $(filterRow).hasClass('hidden');
		filterRow.toggleClass('hidden', !hidden);			
	},	

	attachListeners : function() {
		this.captureContentEditableChanges('#pageContent');
		$('#pageContent').on('click', '.update-task', $.proxy(this.handlePersistTaskRequest, TaskPageScripts));
		$('#pageContent').on('change', '.task-row [contenteditable]', $.proxy(this.handleTextChange, TaskPageScripts));
		$('#pageContent').on('click', '.task-status :input[type="radio"]', $.proxy(this.handleTextChange, TaskPageScripts));
		$('#pageContent').on('click', '.task-filter-row td', $.proxy(this.handleFilterFocus, TaskPageScripts));
		$('#pageContent').on('click', '#toggle-filter', $.proxy(this.handleToggleFilterRow, TaskPageScripts));
		$('#pageContent').on('click', '#toggle-add', $.proxy(this.handleToggleAddRow, TaskPageScripts));
	}
};

$(function() {
	$.proxy(TaskPageScripts.attachListeners(), TaskPageScripts);
});