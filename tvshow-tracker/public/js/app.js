'use strict';

//Declare app level module which depends on filters, and services
angular.module('MyApp', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
    .config(['$routeProvider',
        //setup mapping routes and templates
        function($routeProvider){
            $routeProvider.
                when('/', {
                    controller: 'deviceListCtrl',
                    templateUrl: 'listDevices.html'
                }).
                when('/add', {
                    controller: 'addDeviceCtrl',
                    templateUrl: 'addDevice.html'
                }).
                when('/edit/:id', {
                    controller: 'editDeviceCtrl',
                    templateUrl: 'addDevice.html'
                }).
                otherwise({
                    redirectTo: '/'
                });
    }]);

