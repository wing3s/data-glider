var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes    = require('./routes/index');
var flights   = require('./routes/flights');
var dbConfigs = require('./routes/db_configs');
var dbHandler = require('./routes/db_handler');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.get('/db_handler/query/:db_config/:freq/:schema/:table/:timefield/:range', dbHandler.query);
app.get('/db_handler/test/:db_config/:freq/:schema/:table/:timefield', dbHandler.test);
app.get('/db_handler/touch/:db_config', dbHandler.touch);
app.get('/db_handler/reset/:db_config', dbHandler.resetConn);

app.get('/flights', flights.findAll);
app.get('/flights/:id', flights.findByID);
app.post('/flights', flights.addFlight);
app.put('/flights/:id', flights.updateFlight);
app.delete('/flights/:id', flights.deleteFlight);

app.get('/db_configs', dbConfigs.findAll);
app.get('/db_configs/:id', dbConfigs.findByID);
app.post('/db_configs', dbConfigs.addDBConfig);
app.put('/db_configs/:id', dbConfigs.updateDBConfig);
app.delete('/db_configs/:id', dbConfigs.deleteDBConfig);
app.get('/db_configs_types', dbConfigs.getTypes);
app.get('/db_group_by_freqs', dbConfigs.getFreqs);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;