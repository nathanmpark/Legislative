var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) 
  // res.render('index', { title: 'Express' });

  {
  res.render('index', 
  { 
    heading: 'Welcome', 
    welcome: 'This is how easy it is to embed HTML inside Express Views'
  });

	// res.render('index', 
	// 	{ 
	// 		title: 'html' 
	// 	});
});

module.exports = router;
