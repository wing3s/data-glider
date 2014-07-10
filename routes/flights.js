var nStore = require('nstore');
nStore = nStore.extend(require('nstore/query')());
var Flights = nStore.new('data/Flights.db', function() {
});

exports.findAll = function(req, res) {
    Flights.all(function(err, results) {
        if (err) {
            res.send({error: err});
            return;
        }
        flights = [];
        for (var key in results) {
            var flight = results[key];
            flight.id = key;
            flights.push(flight);
        }
        res.send(flights);
    });
};

exports.findByID = function(req, res) {
    var id = req.params.id;
    Flights.get(id, function(err, doc, key) {
        if (err) {
            res.send({error: err});
            return;
        }
        res.send(doc);
    });
};

exports.deleteFlight = function(req, res) {
    var id = req.params.id;
    Flights.remove(id, function(err) {
        if (err) {
            res.send({error: err});
            return;
        }
        res.send('Removed ' + id);
    });
};

exports.updateFlight = function(req, res) {
    var id = req.params.id;
    var flight = req.body;
    Flights.save(id, flight, function(err) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(flight);
        }
    );
};

exports.addFlight = function(req, res) {
    var flight = req.body;
    Flights.find(flight, function(err, results) {
        if (err) {
            res.send({error: err});
            return;
        }
        if (!Object.keys(results).length) {
            Flights.save(null, flight, function(err, key) {
                if (err) {
                    res.send({error: err});
                    return;
                }
                res.send({key:key});
            });
        }
    });
};