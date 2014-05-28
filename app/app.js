var app = angular.module('main-container-module', []);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/tasks',
            {
                controller: 'TasksController',
                templateUrl: '/app/partials/tasks-table.html'
            })
        .otherwise({ redirectTo: '/tasks' });
});