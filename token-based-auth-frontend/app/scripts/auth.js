/**
 * Created by Zida on 2015/2/17.
 */
angular.module('angularRestfulAuth', [])
    .factory('auth', ['$resource', function ($resource) {
        return $resource('http://localhost\\:3000/devices/:deviceId',
            {},
            {update: {method:'PUT'}, isArray:false}
        );
    }]);