(function($angular) {

    // Off we go!
    $angular.module('rangeApp', ['ngRangeSlider']).controller('size-controller', function IndexController($scope) {

        /**
         * @property range
         * @type {{from: number, to: number}}
         */
        $scope.range = { from: 0, to: 1920 };

        /**
         * @property max
         * @type {Number}
         */
        $scope.max = 1920;

/*         $scope.$watch('range', function(newVal, oldVal) {
            alert("updated");
        }); */
        
    });


})(window.angular);