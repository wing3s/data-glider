app.directive('gliderchart', function(RowChartService, UpdateFreqService, RangeService, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            flight: '=',
        },
        template: '<div id="chart_{{flight.db_config}}{{flight.schema}}{{flight.table}}{{flight.timefield}}" class="col-md-{{chart_width}}"> </div>',
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
            scope.chart_width = 12/RowChartService.getVal();

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
                var options    = getColumnChartOptions(chartContainerID, freq, schema, table, timefield);
                var chart      = new Highcharts.Chart(options);
                var ajax_url   = [api_url, db_config, freq, schema, table, timefield, range].join('/');

                scope.$watch(function() {
                    return RowChartService.getIndex();
                }, function(newVal, oldVal) {
                    scope.chart_width = 12/RowChartService.getVal();
                    $timeout(function() {
                        chart.reflow();
                    }, 1);
                });

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


app.directive('spaceusagechart', function(UpdateFreqService) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            model: '=',
        },
        template: '<div id="chart_{{model.name}}" class="col-md-5"> a</div>',
        link: function(scope, element) {
            if (!scope.model) {
                element.remove();
                return;
            }
            scope.$watch(function() {
                return UpdateFreqService.getIndex();
            }, function(newVal, oldVal) {
                scope.model.updateFreq = UpdateFreqService.getVal();
            });
            scope.$watch('model', function() {
                if (scope.autoLoad) {
                    clearTimeout(scope.autoLoad);
                }
                var api_url   = '/db_handler/spaceUsage';
                var chartContainerID = element[0];
                var unitSize   = 'MB';
                var db_config  = scope.model.name;
                var updateFreq = scope.model.updateFreq || UpdateFreqService.getVal();
                var options    = getPieChartOptions(chartContainerID, db_config, unitSize);
                var chart      = new Highcharts.Chart(options);
                var ajax_url   = [api_url, db_config, unitSize].join('/');
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
                                // console.log(resp);
                                // HighchartsColors
                                // if (chart.series) {
                                //     chart.series[0].setData(resp);
                                // }
                                // if (chart.xAxis) {
                                //     chart.xAxis[0].removePlotBand('band' + chartContainerID);
                                //     var base_line = resp[resp.length-1][0];
                                //     chart.xAxis[0].addPlotBand({
                                //         from: base_line - ms[freq]/2,
                                //         to: base_line + ms[freq]/2,
                                //         color: '#FCFFC5',
                                //         id: 'band' + chartContainerID
                                //     });
                                // }
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