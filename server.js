var _				= require('lodash'),
		fs 			= require('fs'),
		express = require('express'),
		request = require('request'),
		cheerio = require('cheerio');

/* Routes */
var plp 				= require('./routes/plp'),
		categories 	= require('./routes/categories');

var app = express();

app.get('/plp', plp.index);
app.get('/categories', categories.index);

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
