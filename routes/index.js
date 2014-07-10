var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Data Glider',
    description: 'an Easy way to scan time based data',
    });
});

module.exports = router;