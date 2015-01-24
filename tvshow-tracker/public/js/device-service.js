'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('devicesServices', [])
    .config(['$httpProvider', function($httpProvider){
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
    }])
    .factory('Devices', ['$resource', function ($resource) {
        return $resource('http://localhost\\:3000/devices/:deviceId',
            {},
            {update: {method:'PUT'}, isArray:false}
        );
    }]);