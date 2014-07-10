app.controller('flight-controller', function($scope, $http, $log, $rootScope, FlightService, DBConfigService) {
    // Initialize
    FlightService.query(function(data) {
        $scope.flights = data;
        angular.forEach($scope.flights, function(flight) {
            updateFlightStatus(flight);
        });
    }, function(err) {
        $log.error(err);
    });
    $http.get('/db_group_by_freqs').success(function(data) {
        $scope.freqs = data;
    }).error(function(data, status) {
        console.warn(status);
    });
    $scope.orderByField = 'schema';
    $scope.reverseSort  = false;

    $scope.addFlight = function() {
        $scope.inserted = {
            db_config: null,
            schema: null,
            table: null,
            timefield: null
        };
        $scope.flights.push($scope.inserted);
    };

    $scope.cancelChange = function(flight) {
        if (!flight.id) {
            $scope.flights.splice($scope.flights.indexOf(flight), 1);
        }
    };

    $scope.updateFlight = function(flight) {
        if (flight.id) {
            FlightService.update({id: flight.id}, flight, function() {
                updateFlightStatus(flight);
                $rootScope.$broadcast('FlightUpdated', flight);
            }, function(err) {
                $log.warn(err);
            });
        } else {
            FlightService.save(flight, function(data) {
                flight.id = data.key;
                updateFlightStatus(flight);
                $rootScope.$broadcast('FlightAdded', flight);
            }, function(err) {
                $log.error(err);
            });
        }
    };

    $scope.deleteFlight = function(flight) {
        FlightService.delete({id: flight.id}, function() {
            $rootScope.$broadcast('FlightDeleted', flight);
            $scope.flights.splice($scope.flights.indexOf(flight), 1);
        }, function(err) {
            $log.warn(err);
        });
    };

    function fetchDBConfigList() {
        DBConfigService.query(function(data) {
            $scope.configs = [];
            angular.forEach(data, function(db_config) {
                $scope.configs.push(db_config['name']);
            });
        }, function(err) {
            $log.error(err);
        });
    }
    fetchDBConfigList();
    $scope.$on('DBConfigChanged', function(event) {
        fetchDBConfigList();
    });

    $scope.checkEmpty = function(data) {
        if (!data || data === '' || data === '?') {
            return 'Empty';
        }
    };

    function updateFlightStatus(flight) {
        var test_url = [
            'db_handler/test',
            flight.db_config,
            flight.freq,
            flight.schema,
            flight.table,
            flight.timefield].join('/');
        $http.get(test_url).success(function(data) {
            if ('success' in data && data['success'] === 1) {
                flight.status = 'success';
            } else {
                flight.status = 'danger';
            }
        }).error(function(err) {
            flight.status = 'danger';
        });
    }
});