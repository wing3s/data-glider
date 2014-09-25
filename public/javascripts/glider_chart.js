var ms = {
    daily : 86400 * 1000,
    hourly: 3600 * 1000
};

function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTimeZone() {
    return /\((.*)\)/.exec(new Date().toString())[1];
}

function getColumnChartOptions(target, freq, schema, table, timefield) {
    var options = {
        chart: {
            renderTo: target,
            type: 'column'
        },
        title: {
            text: table
        },
        subtitle: {
            text: "GROUP BY " + timefield + " " + freq.toUpperCase()
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                hour: '%H'
            },
            title: {
                text: timefield + " (" + getTimeZone() + ")"
            }
        },
        yAxis: {
            title: {
                text: ucfirst(freq) + ' Count'
            }
        },
        plotOptions: {
            series: {
                shadow: false,
                pointRange: ms[freq] * 2
            }
        },
        series: [{
            name: table,
            data: [],
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                x: 4,
                y: 10,
                style: {
                    fontSize: '10px',
                    fontFamily: 'Verdana, sans-serif'
                }
            },
        }]
    };
    if (freq == 'hourly') {
        options.tooltip = {
            formatter: function() {
                return getTimeZone() + ' Hour: '+ new Date(this.x).getHours() +
                       ', <b>UTC Hour: ' + new Date(this.x).getUTCHours() +
                       '</b> having <b>'+ this.y +'</b>';
            }
        };
    } else {
        options.colors = ['#a5aad9'];
    }
    return options;
}

function getPieChartOptions(target, db_config, unitSize) {
    var options = {
        chart: {
            renderTo: target,
            type: 'pie'
        },
        title: {
            text: db_config + ' Space Usage'
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%']
            }
        },
        tooltip: {
            valueSuffix: unitSize
        },
        series: [{
            name: 'Schema/Database',
            // data: schemaData,
            size: '60%',
            dataLabels: {
                formatter: function () {
                    return this.y > 5 ? this.point.name : null;
                },
                color: 'white',
                distance: -30
            }
        }, {
            name: 'Table',
            // data: tableData,
            size: '80%',
            innerSize: '60%',
            dataLabels: {
                formatter: function () {
                    // display only if larger than 1
                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%'  : null;
                }
            }
        }]
    };
    return options;
}