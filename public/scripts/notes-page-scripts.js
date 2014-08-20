$(function() {

	function initialise() {
		window.oncontextmenu = function ()
		{
		    return false;
		}
	};

	function getElementScope(elementId, callback) {
		var element = document.getElementById(elementId);
		angular.element(element).scope().$apply(callback);
	};	

	function labelSelectHandler(event) {
		var container = $(event.currentTarget),
			expanded = container.hasClass('expanded');
		container.toggleClass('expanded', !expanded);	
	};

	function handleNoteContentChange(event) {
		getElementScope('note-content-editor', function(scope) {
			scope.NotesView.Selected.content = $('.note-content').text();
		});
	}

	function attachListeners(self) {
		$(document).on('click', '.node-name', $.proxy(labelSelectHandler, self));
		$(document).on('change', '.note-content[contenteditable]', $.proxy(handleNoteContentChange, self));
	};

	// initialise();
	attachListeners(this);


});