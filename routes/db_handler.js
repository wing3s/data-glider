var DBConfigs = require('./db_configs').DBConfigs;
var getKeys   = require('../helper').getKeys;
var databases = {
    'mysql'  : require('./mysqlGlider'),
    'vertica': require('./verticaGlider')
};
var conns = {};

exports.query = function query(req, res) {
    var name = req.params.db_config;
    var freq = req.params.freq;
    if (conns[name]) {
        if (freq === 'hourly') {
            conns[name].hourlyCount(req, res);
        }
        if (freq === 'daily') {
            conns[name].dailyCount(req, res);
        }
    } else {
        establishConn(req, res, query);
    }
};

exports.test = function test(req, res) {
    var name = req.params.db_config;
    if (conns[name]) {
        conns[name].test(req, res);
    } else {
        establishConn(req, res, test);
    }
};

exports.touch = function touch(req, res) {
    var name = req.params.db_config;
    if (conns[name]) {
        conns[name].touch(req, res);
    } else {
        establishConn(req, res, touch);
    }
};

exports.resetConn = function resetConn(req, res) {
    establishConn(req, res, null);
};

var establishConn = function(req, res, callback) {
    var name = req.params.db_config;
    DBConfigs.find({name: name}, function(err, results) {
        var keys = getKeys(results);
        if (keys.length !== 1) {
            console.error({error: 'db_config name not found as ' + name});
            res.send({error: 'db_config name not found as ' + name});
            return;
        } else {
            var db_config = results[keys[0]];
            var database = databases[db_config.type];
            var conn = new database(db_config);
            conns[name] = conn;
            if (callback) {
                callback(req, res);
            } else {
                res.send({success: db_config});
            }
        }
    });
};