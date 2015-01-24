'use strict';

//Declare app level module which depends on filters, and services
angular.module('app', ['deviceCtrl', 'devicesServices', 'ngRoute', 'ngResource'])
    .config(['$routeProvider',
        //setup mapping routes and templates
        function($routeProvider){
            $routeProvider.
//                when('/', {
//                    controller: 'deviceListCtrl',
//                    templateUrl: 'listDevices.html'
//                }).
//                when('/add', {
//                    controller: 'addDeviceCtrl',
//                    templateUrl: 'addDevice.html'
//                }).
//                when('/edit/:id', {
//                    controller: 'editDeviceCtrl',
//                    templateUrl: 'addDevice.html'
//                }).
//                otherwise({
//                    redirectTo: '/'
//                });
    }]);

