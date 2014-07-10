var compareByID = require('../helper').compareByID;
var nStore      = require('nstore');
nStore = nStore.extend(require('nstore/query')());
var DBConfigs = nStore.new('data/DBConfigs.db', function() {
});
exports.DBConfigs = DBConfigs;

exports.findAll = function(req, res) {
    DBConfigs.all(function(err, results) {
        if (err) {
            res.send({error: err});
            return;
        }
        configs = [];
        for (var key in results) {
            var config = results[key];
            config.id = key;
            configs.push(config);
        }
        configs.sort(compareByID);
        res.send(configs);
    });
};

exports.getTypes = function(req, res) {
    res.send(['mysql', 'vertica']);
};

exports.getFreqs = function(req, res) {
    res.send(['daily', 'hourly']);
};

exports.findByID = function(req, res) {
    var id = req.params.id;
    DBConfigs.get(id, function(err, doc, key) {
        if (err) {
            res.send({error: err});
            return;
        }
        res.send(doc);
    });
};

exports.deleteDBConfig = function(req, res) {
    var id = req.params.id;
    DBConfigs.remove(id, function(err) {
        if (err) {
            res.send({error: err});
            return;
        }
        res.send('Removed ' + id);
    });
};

exports.updateDBConfig = function(req, res) {
    var id = req.params.id;
    var db_config = req.body;
    DBConfigs.save(id, db_config, function(err) {
        if (err) {
            res.send(err);
            return;
        }
        res.send(db_config);
    });
};

exports.addDBConfig = function(req, res) {
    var db_config = req.body;
    DBConfigs.save(null, db_config, function(err, key) {
        if (err) {
            res.send({error: err});
            return;
        }
        res.send({key:key});
    });
};