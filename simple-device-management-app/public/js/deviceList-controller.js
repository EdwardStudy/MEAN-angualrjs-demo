'use strict';

/* Controllers */

angular.module('deviceCtrl', [])
    .controller('deviceListCtrl', ['$scope', 'Devices', function($scope, Devices){
        $scope.devices = Devices.query(function success() {
            console.log("Info: deviceListController: Query success.");
        }, function error(response) {
            console.log("Error: deviceListController: Query: Request Failed ", response.status);
            //access response headers
            console.log(response.headers());
        });

        $scope.remove = function (index) {
            var devId = $scope.devices[index].id;
            console.log('Info: deviceListController: deviceId to remove: ', devId);
            Devices.delete({deviceId: devId}, function success(data, status) {
                console.log("Info: deviceListController: Remove device succeeded");
                $scope.devices.splice(index, 1);
            }, function error(response) {
                console.log("Error: deviceListController: Remove device Failed Status: ", response.status);
            });
        }
    }])
    .controller('addDeviceCtrl', ['$scope', '$location', 'Devices', function($scope, $location, Devices){
        // set the add/edit flag
        $scope.add = true;

        $scope.add = function (device) {
            if (!device) return;

            var randomNumber = Math.floor(Math.random() * 1001);
            device['id'] = randomNumber;

            var newDevice = new Devices(device);
            newDevice.$save(function success() {
                // redirect to main screen
                $location.path('#/');
            }, function error(response) {
                console.log('Error: addDeviceController: Add device Failed Status: ', response.status);
            });
        }
    }])
    .controller('editDeviceCtrl', ['$scope', '$location', '$routeParams', 'Devices', function($scope, $location, $routeParams, Devices){
        console.log('Info: editDeviceController: GET id: ', $routeParams.id);
        // get the device based on parameter id
        var device = Devices.get({deviceId: $routeParams.id}, angular.noop, function error() {
            console.log('Error: editDeviceController: Get id: ', $routeParams.id);
        });

        console.log('Info: editDeviceController: device: ', device);

        // set the add/edit flag
        $scope.add = false;

        // deep copies the selected item into scope
        $scope.device = device;

        $scope.update = function (device) {
            if (!device) return;

            Devices.update({deviceId: device.id}, device, function success() {
                console.log('Info: editDeviceController: saved device: ', device);
            }, function error(response) {
                console.log('Error: editDeviceController: unable to update due to ', response.sttus);
            });

            // redirect to main screen
            $location.path('#/');
        }
    }]);
