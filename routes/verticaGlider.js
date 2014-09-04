var Vertica = require('vertica');
var conn_time_limit = 3 * 1000;

function VerticaConn(db_config) {
    var conn_err = null;
    this.db_config_set = {
        host: db_config.host,
        user: db_config.user,
        password: db_config.password
    };
    this.conn = Vertica.connect(this.db_config_set, function(err) {
        if (err) {
            conn_err = err;
        }
    });
    this.getConnErr = function() {
        return conn_err;
    };
}

VerticaConn.prototype.test = function(req, res) {
    var conn_err = this.getConnErr;
    setTimeout(function() {
        if (conn_err()) {
            res.send({error:conn_err()});
        }
        return;
    }, conn_time_limit);
    var schema    = req.params.schema;
    var table     = req.params.table;
    var timefield = req.params.timefield;
    var query = "SELECT 1 val FROM "+schema+"."+table+" WHERE "+timefield+" IS NOT NULL LIMIT 1; COMMIT;";
    this.conn.query(query, function(err, resultset) {
        if (err) {
            res.send({'error': err});
            return;
        }
        var rows = resultset.rows;
        if (rows[0]) {
            if (rows[0][0] === 1) {
                res.send({success: 1});
            } else {
                res.send({error: 'returned ' + rows[0][0]});
            }
        } else {
            res.send({error: 'returned' + rows[0]});
        }
    });
};

VerticaConn.prototype.touch = function(req, res) {
    var conn_err = this.getConnErr;
    setTimeout(function() {
        if (conn_err()) {
            res.send({error:conn_err()});
        }
        return;
    }, conn_time_limit);
    var query = "SELECT 1 as val; COMMIT;";
    this.conn.query(query, function(err, resultset) {
        if (err) {
            res.send({'error': err});
            return;
        }
        var rows = resultset.rows;
        if (rows[0]) {
            if (rows[0][0] === 1) {
                res.send({success: 1});
            } else {
                res.send({error: 'returned ' + rows[0][0]});
            }
        } else {
            res.send({error: 'returned' + rows[0]});
        }
    });
};

VerticaConn.prototype.spaceUsage = function(req, res) {
    var conn_err = this.getConnErr;
    setTimeout(function() {
        if (conn_err()) {
            res.send({error:conn_err()});
        }
        return;
    }, conn_time_limit);
    var unitSize = req.params.unitSize || 'MB';
    var sizeMap = {
        KB : 1024,
        MB : 1024*1024,
        GB : 1024*1024*1024
    };
    var query = "SELECT anchor_table_schema as schema," +
                "       anchor_table_name as table," +
                "       ROUND(SUM(used_bytes/(" + sizeMap[unitSize] + ")), 1.0) AS usage " +
                "FROM column_storage " +
                "GROUP BY anchor_table_schema, anchor_table_name " +
                "ORDER BY anchor_table_schema, anchor_table_name;";
    this.conn.query(query, function(err, resultset) {
        if (err) {
            res.send({'error': err});
            return;
        }
        var rows = resultset.rows;
        res.send(rows);
    });
};

VerticaConn.prototype.hourlyCount = function (req, res) {
    var conn_err = this.getConnErr;
    setTimeout(function() {
        if (conn_err()) {
            res.send({error:conn_err()});
        }
        return;
    }, conn_time_limit);
    var schema      = req.params.schema;
    var table       = req.params.table;
    var timefield   = req.params.timefield;
    var range       = req.params.range || 36;
    var query = "SELECT EXTRACT(EPOCH FROM TRUNC("+timefield+", 'HH'))*1000 datehour, COUNT(1) "+
                "FROM "+schema+"."+table+" " +
                "WHERE "+timefield+" >= TRUNC(TIMESTAMPADD(hour, -"+range+", NOW()), 'HH') " +
                "GROUP BY TRUNC("+timefield+", 'HH') " +
                "ORDER BY TRUNC("+timefield+", 'HH') ; COMMIT;";
    this.conn.query(query, function(err, resultset) {
        if (err) {
            res.send({error: err});
            return;
        }
        var rows = resultset.rows;
        if (rows.length < 1) {
            res.send({error: 'null query result for '+ query});
            return;
        }
        var currentHour = Math.floor(Date.now()/global.hour_in_ms)*global.hour_in_ms;
        var latestHour = rows[rows.length-1][0];
        for (var cursorHour=latestHour+global.hour_in_ms; cursorHour<=currentHour; cursorHour+=global.hour_in_ms) {
            rows.push([cursorHour, null]);
        }
        res.send(rows);
    });
};

VerticaConn.prototype.dailyCount = function (req, res) {
    var conn_err = this.getConnErr;
    setTimeout(function() {
        if (conn_err()) {
            res.send({error:conn_err()});
        }
        return;
    }, conn_time_limit);
    var schema      = req.params.schema;
    var table       = req.params.table;
    var timefield   = req.params.timefield;
    var range       = req.params.range || 36;
    var query = "SELECT EXTRACT(EPOCH FROM TRUNC("+timefield+", 'DD'))*1000 date, COUNT(1) "+
                "FROM "+schema+"."+table+" " +
                "WHERE "+timefield+" >= TRUNC(TIMESTAMPADD(day, -"+range+", NOW()), 'DD') "+
                "GROUP BY TRUNC("+timefield+", 'DD') " +
                "ORDER BY TRUNC("+timefield+", 'DD') ; COMMIT;";
    this.conn.query(query, function(err, resultset) {
        if (err) {
            res.send({error: err});
            return;
        }
        var rows = resultset.rows;
        if (rows.length < 1) {
            res.send({error: 'null query result for '+ query});
            return;
        }
        var currentDay = Math.floor(Date.now()/global.day_in_ms)*global.day_in_ms;
        var latestDay  = rows[rows.length-1][0];
        for (var cursorDay=latestDay+global.day_in_ms; cursorDay<=currentDay; cursorDay+=global.day_in_ms) {
            rows.push([cursorDay, null]);
        }
        res.send(rows);
    });
};

module.exports = VerticaConn;