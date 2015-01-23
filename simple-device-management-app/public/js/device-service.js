//create a module to support getting and managing the device list
var deviceModule = angular.module('DeviceModule', []);

deviceModule.factory('Devices',['$resource', function($resource){
    return $resource('http://localhost\\:3000/devices/:deviceId', {},
        { update: {}, isArray: false});

//    var items = {};
//
//    items.data = [
//            {id:0, name: "iphone", assetTag: "a23456", onwer: "dev", desc: "iOS8.1.3"},
//            {id:1, name: "loaner-laptop-1", assetTag: "a13936", onwer: "dev", desc: ""},
//            {id:2, name: "loaner-laptop-3", assetTag: "a43056", onwer: "qa", desc: ""},
//            {id:3, name: "android", assetTag: "a33756", onwer: "dev", desc: "android4.2"},
//            {id:4, name: "galaxy tab", assetTag: "a53356", onwer: "dev", desc: "android"},
//            {id:5, name: "loaner-laptop-2", assetTag: "a65535", onwer: "qa", desc: ""},
//            {id:6, name: "iphone", assetTag: "a73856", onwer: "dev", desc: "iOS8.1.3"},
//        ];
//
//    items.query = function(){
//        return items.data;
//    }
//
//    items.add = function(device){
//        items.data.push(device);
//    }
//
//    items.update = function(device) {
//        // find the selected device & update
//        items.data.forEach(function (item, i) {
//            if (item.id == device.id) {
//                // update
//                items.data[i] = device;
//                return;
//            }
//        })
//    }
//
//    return items;
}]);