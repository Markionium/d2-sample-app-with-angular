(function () {
/**
 * For D2 we need to point it to which api it should use, this is done through the configuration
 * object. In this example it points to the local instance. (It could be cross domain but this requires more
 * configuration) For installable apps this should be sufficient.
 */
var d2Config = {
    baseUrl: '/dhis/api' //Base url of the DHIS2 api 
};

//We then call the d2 function to initialize the library. It will load the /api/schemas endpoint to calibrate itself
//To learn about which `models` are available in the api. When this completed it will run call the `then` method on
//the returned promise with the initialized version of the library. In this case it it will call `run appWithD2`
d2(d2Config).then(runAppWithD2);

function runAppWithD2(d2) {

    //Simple factory that provides the initiased d2 to the angular app.
    function d2Factory() {
        return d2;
    }

    //Simple angular app for demonstration purposes :)
    angular.module('d2App', [])
        .factory('d2', d2Factory) //Note we make the factory known to angular as d2.
        .factory('indicatorService', indicatorService)
        .directive('indicatorList', indicatorListDirective);

    //Bootstrap the app manually instead of using ng-app
    angular.bootstrap(document.getElementById('d2-app'), ['d2App']);

    //Service to communicate with the models
    function indicatorService(d2, $q) {
        var indicator = d2.models.indicator;
        
        return {
            getIndicators: getIndicators,
            searchByName: searchByName
        };

        function getIndicators() {
            var listPromise = indicator
                .list();
                
            //Because of the way angular works we have to pull the promise through $q (or alternatively call $scope.apply);
            return $q.when(listPromise);
        }

        function searchByName(searchQuery) {
            var searchPromise = indicator
                .filter().on('name').like(searchQuery)
                .list();

            return $q.when(searchPromise);
        }
    }

    function indicatorListDirective() {
        return {
            template: [
                '<div>',
                    '<input type="search" ng-model="vm.searchQuery" ng-model-options="{debounce: 500}" ng-change="vm.searchIndicators()" />',
                    '<div ng-show="vm.results"><span ng-bind="vm.results"></span> indicators found</div>',
                    '<ul>',
                        '<li ng-repeat="indicator in vm.indicators" ng-bind="indicator.name"></li>',
                    '</ul>',
                '</div>'].join(''),
            controllerAs: 'vm',
            controller: indicatorListDirectiveController
        };

        function indicatorListDirectiveController(indicatorService) {
            var vm = this;
                
            //Properties
            vm.indicators = [];
            vm.searchQuery = '';
            vm.results = 0;

            //Methods
            vm.searchIndicators = searchIndicators;

            //Initialise the indicatorlist
            indicatorService.getIndicators()
                .then(function (indicatorCollection) {
                    vm.results = indicatorCollection.pager.total;
                    vm.indicators = indicatorCollection.toArray();
                });

            //Event handler for on change
            function searchIndicators() {
                indicatorService.searchByName(vm.searchQuery)
                    .then(function (indicatorCollection) {
                        vm.results = indicatorCollection.pager.total;
                        vm.indicators = indicatorCollection.toArray();
                    });
            }
        }
    }
}

})();