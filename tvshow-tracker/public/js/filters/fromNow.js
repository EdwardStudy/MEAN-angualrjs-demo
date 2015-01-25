angular.module('MyApp').
    filter('fromNow', function () {
        return function (date) {
            //use monent.ks lib to output a friendly date
            return moment(date).fromNow();
        }
    });