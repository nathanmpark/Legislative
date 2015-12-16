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
    	{
        'bill_id': req.body.bill_id,
        'committees':
    			{'committee_id': req.body.committee_id,
    			'committee_name': req.body.committee_name},
        'congress': req.body.congress,
        'chamber' : req.body.chamber,
        'urls':
            {
                'congress': req.body.url_congress,
                'govtrack': req.body.url_govtrack,
                'opencongress': req.body.url_opencongress
            },
        'dates':
            {
                'intro_date': req.body.intro_date,
                'last_action_date': req.body.last_action_date,
                'last_version_date': req.body.last_version_date
            },
        'history': req.body.history
    	},
    	{
        'bill_id': req.body.bill_id,
        'committees':
                {'committee_id': req.body.committee_id,
                'committee_name': req.body.committee_name},
        'congress': req.body.congress,
        'chamber' : req.body.chamber,
        'urls':
            {
                'congress': req.body.url_congress,
                'govtrack': req.body.url_govtrack,
                'opencongress': req.body.url_opencongress
            },
        'dates':
            {
                'intro_date': req.body.intro_date,
                'last_action_date': req.body.last_action_date,
                'last_version_date': req.body.last_version_date
            },
        'history': req.body.history
    	},
    	{'upsert': true},
	    function(err, result){
	        res.send(
	            (err === null) ? { msg: '' } : { msg: err }
	        );
	    }
    );
});

router.get('/bill_data', function(req, res) {
    var db = req.db;
    var collection = db.get('bill_list');
    collection.find({},{},function(e,docs){
        var bill_data = graphData(docs)
        var d3_format = orgData(bill_data)
        res.json(d3_format);
    });

    function graphData(data) {
        var bill_data = {}
        for (var i = 0; i < data.length; i++) {
            var committee_name = data[i].committees.committee_name
            if (bill_data.hasOwnProperty(committee_name)){
                bill_data[committee_name]++;
            } else {
                bill_data[committee_name] = 1;
            };
        }
        return bill_data
    };

    function orgData(bill_data) {
        var d3_array = []
        for (var key in bill_data) {
            var bill_obj = {}
            bill_obj['label'] = key
            bill_obj['value'] = bill_data[key]
            bill_obj['color'] = getRandomColor()
            bill_obj['highlight'] = getRandomColor()
            d3_array.push(bill_obj)
        }
        return d3_array
    };

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
});

module.exports = router;
