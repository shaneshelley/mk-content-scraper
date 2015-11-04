var _				= require('lodash'),
		fs 			= require('fs'),
		express = require('express'),
		request = require('request'),
		cheerio = require('cheerio');

/* Routes */
var pdp 		= require('./routes/pdp'),
		plp 		= require('./routes/plp'),
		promos  = require('./routes/promos');

var app     = express();

app.use('/pdp', pdp);
app.use('/plp', plp);

app.use('/promos', promos);

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
