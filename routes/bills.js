var express = require('express');
var router = express.Router();

router.get('/bill_list', function(req, res) {
    var db = req.db;
    var collection = db.get('bill_list');
    collection.find({},{},function(e,docs){
        if (e){
            console.error("failed!", e);
            res.status(500).send('Failed to get bill list');
        } else {
            res.json(docs);
        }
        // res.json(docs);
    });
});

router.post('/add_bill', function(req, res) {
    var db = req.db;
    var collection = db.get('bill_list');
    console.log("Add Bill Request Body: ",req.body);
    collection.update(
    	{
        'bill_id': req.body.bill_id,
        'official_title': req.body.official_title,
        'short_title': req.body.short_title,
        'committees':
    			{'committee_id': req.body.committee_id,
    			'committee_name': req.body.committee_name},
        'congress': req.body.congress,
        'description': req.body.description,
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
        'history': 
            {
                'active': req.body.active,
                'active_at': req.body.active_at,
                'awaiting_signature': req.body.awaiting_signature,
                'enacted': req.body.enacted,
                'vetoed': req.body.vetoed
            }
    	},
    	{
        'bill_id': req.body.bill_id,
        'official_title': req.body.official_title,
        'short_title': req.body.short_title,
        'committees':
                {'committee_id': req.body.committee_id,
                'committee_name': req.body.committee_name},
        'congress': req.body.congress,
        'description': req.body.description,
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
        'history': 
            {
                'active': req.body.active,
                'active_at': req.body.active_at,
                'awaiting_signature': req.body.awaiting_signature,
                'enacted': req.body.enacted,
                'vetoed': req.body.vetoed
            }
        },
    	{'upsert': true},
	    function(err, result){
            if(err){console.error("failed to add bill", err);}
            if(result){console.log("successfully added bill", result);}
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
        if(e){
            console.error(e);
            res.status(401);
            res.json({error: e});
        } else {
            var bill_data = graphData(docs)
            var d3_format = orgData(bill_data)
            res.json(d3_format);
        }
    });

    function graphData(data) {
        var bill_data = {}
        if(data){
            for (var i = 0; i < data.length; i++) {
                var committee_name = data[i].committees.committee_name
                if (bill_data.hasOwnProperty(committee_name)){
                    bill_data[committee_name]++;
                } else {
                    bill_data[committee_name] = 1;
                };
            }
        } else {
            console.error('No data in graphData()');
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

router.get('/tree_data', function(req, res) {
    var db = req.db;
    var collection = db.get('bill_list');
    collection.find({},{},function(e,docs){
        if(e){
            console.error(e);
            res.status(401);
            res.json({error: e});
        } else {
            var bill_data = graphData(docs)
            res.json(bill_data);
        }
    });

    function graphData(data) {
        var bill_data = {}
        if(data){
            for (var i = 0; i < data.length; i++) {
                var committee_name = data[i].committees.committee_name
                if (bill_data.hasOwnProperty(committee_name)){
                    bill_data[committee_name]++;
                } else {
                    bill_data[committee_name] = 1;
                };
            }
        } else {
            console.error('No data in graphData()');
        }
        return bill_data
    };
});


























// SEED ROUTES BE CARFEUL
router.get('/seed_114', function(req, res, next){
    res.render('seed_114');
})

router.post('/seed_bills', function(req, res, next){
    var db = req.db;
    var collection = db.get('oneonefour_bills');

    console.log("Successful Hit to #seed_bills");
    // console.log(req.body);

    collection.insert(req.body);
});

module.exports = router;
