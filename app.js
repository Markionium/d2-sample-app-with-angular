(function () {
/**
 * If you're not running the app on the same port as the dhis2 server you will 
 * need to provide the authentication headers with each request. In this example
 * i added this because it is running against the demo environment.
 * DHIS2 since 2.17 (i believe) supports cross domain access through a whitelist of domains.
 * If the example does not run it might be because the domain is removed from the whitelist
 * on the following url https://apps.dhis2.org/dev/dhis-web-maintenance-settings/systemAccessSettings.action
 * the CORS whitelist should have http://localhost:9000 and/or http://0.0.0.0:9000
 */

//TODO: Replace these with your own username and password
//Obviously do not use this for production this is for demonstration purposes only.
//Since you're probably creating an app with a manifest.webapp you won't need this jquery setup part
var username = 'admin';
var password = 'District1';

jQuery.ajaxSetup({
    headers: {
        "Authorization": 'Basic ' + btoa([username, password].join(':'))
    }
});

/**
 * Now for D2 we need to point it to which api it should use, this is done through the configuration
 * object. In this example it points to the demo instance.
 */
var d2Config = {
    baseUrl: 'http://localhost:8080/dhis/api' //Base url of the DHIS2 api 
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