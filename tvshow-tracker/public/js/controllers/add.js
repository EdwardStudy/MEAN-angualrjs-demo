angular.module('MyApp')
    .controller('AddCtrl', ['$scope', '$alert', 'Show', function ($scope, $alert, Show) {
        $scope.addShow = function () {
            Show.save({ showName: $scope.showName },
                function () {
                    $scope.showName = '';
                    $scope.addForm.$setPristine();
                    $alert({
                        content: 'TV show has been added.',
                        placement: 'top-right',
                        type: 'success',
                        duration: 3
                    });
                },
                //handle error
                function (response) {
                    $scope.showName = '';
                    //clear the form by changing its state from $dirty to $pristine
                    $scope.addForm.$setPristine();
                    $alert({
                        content: response.data.message,
                        placement: 'top-right',
                        type: 'danger',
                        duration: 3
                    });
                });
        };
    }]);