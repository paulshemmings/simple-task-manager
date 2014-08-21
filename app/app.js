var app = angular.module('main-container-module', []);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/treenotes',
            {
                controller: 'TreeNotesController',
                templateUrl: '/app/partials/treenotes.html'
            })        
        .when('/tasks',
            {
                controller: 'TasksController',
                templateUrl: '/app/partials/tasks-table.html'
            })
        .when('/about',
            {
                controller: 'AboutController',
                templateUrl: '/app/partials/about.html'
            }) 
		.when('/help',
            {
                controller: 'AboutController',
                templateUrl: '/app/partials/help.html'
            }) 
        .otherwise({ redirectTo: '/tasks' });
});