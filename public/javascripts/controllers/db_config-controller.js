app.controller('db_config-controller', function($scope, $http, $log, $rootScope, DBConfigService) {
    // Initialize
    DBConfigService.query(function(data) {
        $scope.db_configs = data;
        $scope.names = [];
        angular.forEach($scope.db_configs, function(db_config) {
            $scope.names.push(db_config['name']);
            updateDBStatus(db_config);
        });
    }, function(err) {
        $log.error(err);
    });
    $http.get('/db_configs_types').success(function(data) {
        $scope.types = data;
    }, function(err) {
        $log.error(err);
    });

    $scope.addDBConfig = function() {
        DBConfigService.save($scope.db_config, function(data) {
            $scope.db_config.id = data.key;
            $rootScope.$broadcast('DBConfigChanged', {});
            updateDBStatus($scope.db_config);
            $scope.db_configs.push($scope.db_config);
            $scope.db_config = null;
        }, function(err) {
            $log.error(err);
            $scope.db_config = null;
        });
    };

    $scope.updateDBConfig = function(db_config) {
        db_config.status = null;
        DBConfigService.update({id: db_config.id}, db_config, function(data) {
            var reset_url = ['db_handler/reset', db_config.name].join('/');
            $http.get(reset_url).success(function(data) {
                $rootScope.$broadcast('DBConfigChanged', {});
                updateDBStatus(db_config);
            }).error(function(err) {
                $log.error(err);
            });
        }, function(err) {
            $log.warn(err);
        });
    };

    $scope.deleteDBConfig = function(db_config_index, db_config) {
        console.log(db_config);
        DBConfigService.delete({id: db_config.id}, function() {
            $scope.db_configs.splice(db_config_index, 1);
            $rootScope.$broadcast('DBConfigChanged', {});
        }, function(err) {
            $log.warn(err);
        });
    };

    // check existing db_config name for updates
    $scope.checkName = function(name) {
        if ($scope.names.indexOf(name) > -1) {
            return 'This name is already taken!';
        }
    };

    // check existing db_config name to add
    $scope.validateName = function(name) {
        if ($scope.names && $scope.names.indexOf(name) > -1) {
            return false;
        } else {
            return true;
        }
    };

    function updateDBStatus(db_config) {
        var test_url = ['db_handler/touch', db_config.name].join('/');
        $http.get(test_url).success(function(data) {
            if ('success' in data && data['success'] === 1) {
                db_config.status = 'success';
            } else {
                db_config.status = 'danger';
            }
        }).error(function(err) {
            db_config.status = 'danger';
        });
    }
});