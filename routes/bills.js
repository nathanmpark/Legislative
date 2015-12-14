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
    collection.update(
    	{'bill_id': req.body.bill_id, 
    		'committees': 
    			{'committee_id': req.body.committee_id, 
    			'committee_name': req.body.committee_name}
    	},
    	{'bill_id': req.body.bill_id, 
    		'committees': 
    			{'committee_id': req.body.committee_id, 
    			'committee_name': req.body.committee_name}
    	}, 
    	{'upsert': true},
	    function(err, result){
	        res.send(
	            (err === null) ? { msg: '' } : { msg: err }
	        );
	    }
    );
});

module.exports = router;
