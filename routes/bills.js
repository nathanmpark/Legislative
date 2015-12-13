var express = require('express');
var router = express.Router();

router.get('/bill_list', function(req, res) {
    var db = req.db;
    var collection = db.get('bill_list');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

router.post('/add_bill', function(req, res) {
    var db = req.db;
    var collection = db.get('bill_list');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

router.post('/add_committee', function(req, res) {
    var db = req.db;
    var collection = db.get('bill_list');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

module.exports = router;
