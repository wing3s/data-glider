app.controller('tab-controller', function($scope, $http, $log, FlightService) {
    // Initialize
    FlightService.query(function(data) {
        $scope.flights = data;
        angular.forEach($scope.flights, function(flight) {
            addFlight(flight);
        });
    }, function(err) {
        $log.error(err);
    });
    $scope.db_configs = {};

    $scope.$on('FlightAdded', function(event, flight) {
        addFlight(flight);
    });

    $scope.$on('FlightUpdated', function(event, flight) {
        delFlight(flight);
        addFlight(flight);
    });

    $scope.$on('FlightDeleted', function(event, flight) {
        delFlight(flight);
    });

    function delFlight(deleteFlight) {
        angular.forEach($scope.db_configs, function(schemas, db_config) {
            angular.forEach(schemas, function(flights, schema) {
                angular.forEach(flights, function(flight, index) {
                    if (flight.id === deleteFlight.id) {
                        $scope.db_configs[db_config][schema].splice(index, 1);
                    }
                });
                if (flights.length <= 0) {
                    delete $scope.db_configs[db_config][schema];
                }
            });
            if (Object.getOwnPropertyNames(schemas).length <= 0) {
                delete $scope.db_configs[db_config];
            }
        });
    }

    function addFlight(flight, index) {
        if (!$scope.db_configs[flight.db_config]) {
            $scope.db_configs[flight.db_config] = {};
        }
        if (!$scope.db_configs[flight.db_config][flight.schema]) {
            $scope.db_configs[flight.db_config][flight.schema] = [];
        }
        $scope.db_configs[flight.db_config][flight.schema].push(flight);
    }
});