app.directive('gliderchart', function(UpdateFreqService, RangeService) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            flight: '=',
        },
        template: '<div id="chart_{{flight.db_config}}{{flight.schema}}{{flight.table}}{{flight.timefield}}" class="col-md-6"> </div>',
        link: function(scope, element) {
            if (!scope.flight) {
                element.remove();
                return;
            }
            scope.$watch(function() {
                return UpdateFreqService.getIndex() + RangeService.getIndex();
            }, function(newVal, oldVal) {
                scope.flight.updateFreq = UpdateFreqService.getVal();
                scope.flight.range      = RangeService.getVal();
            });
            scope.$watch('flight', function() {
                if (scope.autoLoad) {
                    clearTimeout(scope.autoLoad);
                }
                var api_url   = '/db_handler/query';
                var chartContainerID = element[0];
                var db_config  = scope.flight.db_config;
                var schema     = scope.flight.schema;
                var table      = scope.flight.table;
                var freq       = scope.flight.freq;
                var timefield  = scope.flight.timefield;
                var range      = scope.flight.range      || RangeService.getVal();
                var updateFreq = scope.flight.updateFreq || UpdateFreqService.getVal();
                var options    = getChartOptions(chartContainerID, freq, schema, table, timefield);
                var chart      = new Highcharts.Chart(options);
                var ajax_url   = [api_url, db_config, freq, schema, table, timefield, range].join('/');
                (function autoLoad() {
                    chart.showLoading();
                    $.ajax({
                        url: ajax_url,
                        dataType: "json",
                        type: 'GET',
                        success: function(resp) {
                            if ('error' in resp) {
                                console.warn({
                                    error: 'load data failed',
                                    url: ajax_url,
                                    resp: resp
                                });
                            } else {
                                if (chart.series) {
                                    chart.series[0].setData(resp);
                                }
                                if (chart.xAxis) {
                                    chart.xAxis[0].removePlotBand('band' + chartContainerID);
                                    var base_line = resp[resp.length-1][0];
                                    chart.xAxis[0].addPlotBand({
                                        from: base_line - ms[freq]/2,
                                        to: base_line + ms[freq]/2,
                                        color: '#FCFFC5',
                                        id: 'band' + chartContainerID
                                    });
                                }
                            }
                            chart.hideLoading();
                        }
                    });
                    scope.autoLoad = setTimeout(autoLoad, updateFreq * 60 * 1000);
                })();
            }, true);
        }
    };
});