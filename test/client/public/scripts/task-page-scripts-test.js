describe("task-page-scripts test", function() {
	
	beforeEach(function() {
		jasmine.getFixtures().fixturesPath = '';
		loadFixtures('base/fixtures/task-page-fixture.html');
	});

	it("contains spec with an expectation", function() {
		expect(true).toBe(true);
	});

	it("should load a correct task model from the task table", function() {
		var container = $('#12345');
		expect(container.length).toEqual(1);
		expect(container.data('task-id')).toEqual(12345);
		var model = TaskPageScripts.buildTaskModel(container);
		expect(model._id).toEqual(12345);
		expect(model.status).toEqual('0');
		expect(model.name).toEqual('Test Task Name');
		expect(model.blockers).toEqual('Test Task Blocker');
		expect(model.solutions).toEqual('Test Task Solution');
		expect(model.hidden).toEqual(false);
	});

	it("should get the closest tr to the element firing the event", function() {
		var container = $('#12345');
		var element = TaskPageScripts.getTaskContainer({
			target : $(container).find(':input')
		})
		expect(element.attr('id')).toEqual('12345');
	});

	it("should find all the fields of the add row and clear them", function() {
		var editables = $('#new-task-row').find("[contenteditable]");
		$.each(editables, function() {
			$(this).text('test test');
		});
		TaskPageScripts.clearAddRow();
		$.each(editables, function() {
			expect($(this).text()).toEqual("");
		});
	});

	it("should build the model, persist the model, then clear the add row", function() {
		spyOn(TaskPageScripts,"getTaskContainer");
		spyOn(TaskPageScripts,"buildTaskModel");
		spyOn(TaskPageScripts,"validateModel").andReturn(true);
		spyOn(TaskPageScripts,"callTaskControllerPersist");
		TaskPageScripts.handlePersistTaskRequest();
		expect(TaskPageScripts.getTaskContainer).toHaveBeenCalled();
		expect(TaskPageScripts.buildTaskModel).toHaveBeenCalled();
		expect(TaskPageScripts.validateModel).toHaveBeenCalled();
		expect(TaskPageScripts.callTaskControllerPersist).toHaveBeenCalled();
	});
});
