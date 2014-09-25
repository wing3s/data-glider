app.factory('DBConfigService', function($resource) {
    var DBConfigs = $resource('/db_configs/:id', {}, {
        'update': {method: 'PUT'}
    });
    return DBConfigs;
});

app.factory('FlightService', function($resource) {
    var Flights = $resource('/flights/:id', {}, {
        'update': {method: 'PUT'}
    });
    return Flights;
});

app.factory('RowChartService', function($rootScope) {
    var rowCharts = [1, 2, 4, 6, 12];
    var index = 1;
    var rowChartService = {
        getVal: function(inputIndex) {
            if (typeof inputIndex === 'undefined') {
                return rowCharts[index];
            } else {
                return rowCharts[inputIndex];
            }
        },
        getIndex: function() {
            return index;
        },
        setIndex: function(inputIndex) {
            $rootScope.$apply(function(){
                index = inputIndex;
            });
        },
        getLen: function() {
            return rowCharts.length;
        }
    };
    return rowChartService;
});

app.factory('UpdateFreqService', function($rootScope) {
    var updateFreqs = [1, 3, 5, 10, 20];
    var index = 1;
    var updateFreqService = {
        getVal: function(inputIndex) {
            if (typeof inputIndex === 'undefined') {
                return updateFreqs[index];
            } else {
                return updateFreqs[inputIndex];
            }
        },
        getIndex: function() {
            return index;
        },
        setIndex: function(inputIndex) {
            $rootScope.$apply(function(){
                index = inputIndex;
            });
        },
        getLen: function() {
            return updateFreqs.length;
        }
    };
    return updateFreqService;
});

app.factory('RangeService', function($rootScope) {
    var ranges = [6, 12, 24, 36, 48, 72];
    var index = 3;
    var rangeService = {
        getVal: function(inputIndex) {
            if (typeof inputIndex === 'undefined') {
                return ranges[index];
            } else {
                return ranges[inputIndex];
            }
        },
        getIndex: function() {
            return index;
        },
        setIndex: function(inputIndex) {
            $rootScope.$apply(function() {
                index = inputIndex;
            });
        },
        getLen: function() {
            return ranges.length;
        }
    };
    return rangeService;
});