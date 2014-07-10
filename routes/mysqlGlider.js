var mysql = require('mysql');

function MysqlConn(db_config) {
    this.db_config = db_config;
    this.db_config_set = {
        host     : db_config.host,
        user     : db_config.user,
        password : db_config.password,
        connectTimeout : 10 * 1000
    };
    this.pool = mysql.createPool(this.db_config_set);
}

MysqlConn.prototype.test = function test(req, res) {
    var database  = req.params.schema;
    var table     = req.params.table;
    var timefield = req.params.timefield;
    var query = "SELECT 1 val FROM "+database+"."+table+" WHERE "+timefield+" IS NOT NULL LIMIT 1";

    this.pool.getConnection(function(err, conn) {
        if (err) {
            res.send({error: err});
            return;
        }
        conn.query(query, function(err, rows){
            conn.release();
            if (err) {
                res.send({error: err});
                return;
            }
            if (rows.length < 1) {
                res.send({error: 'null query result for ' + query});
                return;
            }
            row = rows[0];
            if (row.val === 1) {
                res.send({success: 1});
            } else {
                res.send({error: 'returned ' + row});
            }
        });
    });
};

MysqlConn.prototype.touch = function touch(req, res) {
    var query = "SELECT 1 as val";

    this.pool.getConnection(function(err, conn) {
        if (err) {
            res.send({error: err});
            return;
        }
        conn.query(query, function(err, rows, fields){
            if (err) {
                res.send({error: err});
                return;
            }
            if (rows.length < 1) {
                res.send({error: 'null query result for ' + query});
                return;
            }
            row = rows[0];
            if (row.val === 1) {
                res.send({success: 1});
            } else {
                res.send({error: 'returned ' + row});
            }
        });
    });
};

MysqlConn.prototype.hourlyCount = function(req, res) {
    var database  = req.params.schema;
    var table     = req.params.table;
    var timefield = req.params.timefield;
    var range     = req.params.range || 36;
    var query = "SELECT FLOOR(UNIX_TIMESTAMP(MIN("+timefield+"))/3600)*3600*1000 as datehour, COUNT(1) as val " +
                "FROM "+database+"."+table+" " +
                "WHERE "+timefield+" >= DATE_SUB(NOW(), INTERVAL "+range+" HOUR) " +
                "GROUP BY DATE("+timefield+"), HOUR("+timefield+") " +
                "ORDER BY DATE("+timefield+"), HOUR("+timefield+")";
    this.pool.getConnection(function(err, conn) {
        if (err) {
            res.send({error: err});
            return;
        }
        conn.query(query, function(err, rows) {
            if (err) {
                res.send({error: err});
                return;
            }
            if (rows.length < 1) {
                res.send({error: 'null query result for ' + query});
                return;
            }
            var data = [];
            for(var index in rows) {
                row = rows[index];
                data.push([row.datehour, row.val]);
            }
            var currentHour = Math.floor(Date.now()/global.hour_in_ms)*global.hour_in_ms;
            var latestHour  = data[data.length-1][0];
            for (var cursorHour=latestHour+global.hour_in_ms; cursorHour<=currentHour; cursorHour+=global.hour_in_ms) {
                data.push([cursorHour, null]);
            }
            res.send(data);
        });
    });
};

MysqlConn.prototype.dailyCount = function(req, res) {
    var database  = req.params.schema;
    var table     = req.params.table;
    var timefield = req.params.timefield;
    var range     = req.params.range || 36;
    var query = "SELECT FLOOR(UNIX_TIMESTAMP(MIN("+timefield+"))/86400)*86400*1000 as date, COUNT(1) as val " +
                "FROM "+database+"."+table+" " +
                "WHERE "+timefield+" >= DATE_SUB(NOW(), INTERVAL "+range+" DAY) " +
                "GROUP BY DATE("+timefield+") " +
                "ORDER BY DATE("+timefield+") ";
    this.pool.getConnection(function(err, conn) {
        if (err) {
            res.send({error: err});
            return;
        }
        conn.query(query, function(err, rows, fields) {
            if (err) {
                res.send({error: err});
                return;
            }
            if (rows.length < 1) {
                res.send({error: 'null query result for ' + query});
                return;
            }
            var data = [];
            for(var index in rows) {
                row = rows[index];
                data.push([row.date, row.val]);
            }
            var currentDay = Math.floor(Date.now()/global.day_in_ms)*global.day_in_ms;
            var latestDay  = data[data.length-1][0];
            for (var cursorDay=latestDay+global.day_in_ms; cursorDay<=currentDay; cursorDay+=global.day_in_ms) {
                data.push([cursorDay, null]);
            }
            res.send(data);
        });
    });
};

module.exports = MysqlConn;