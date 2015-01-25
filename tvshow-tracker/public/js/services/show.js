angular.module('MyApp')
    .factory('Show', ['$resource', function ($resource) {
        var shows =  $resource('/api/shows/:_id',{}
        );
        return shows;
    }]);