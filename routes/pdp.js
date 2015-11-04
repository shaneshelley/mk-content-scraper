var _				= require('lodash'),
    cheerio = require('cheerio'),
    express = require('express'),
    fs 			= require('fs'),
    request = require('request');

var router = express.Router();

// define the home page route
router.get('/', function(req, res) {
  // View all bags
	url = 'http://www.michaelkors.com/selma-medium-saffiano-leather-satchel/_/R-US_30T3SLMS2L?No=3&color=0405';

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var productsJSON = {
				categories 	: [],
				filters 		: [],
				products		: []
			};

			/* Categories */
			$('.category_list').filter(function(){
        var $data = $(this);
				var categoryHTML = $data.find('a');

				var categories = []
				_.each(categoryHTML, function(category) {
					productsJSON.categories.push($(category).attr('title'));
				});
      })

			/* Filters */
			$('.filters_container').filter(function(){
				var $data = $(this);
				var filtersHTML = $data.find('.swatch_container');

				_.each(filtersHTML, function(filter){
					var tmp = {};

					tmp.property = $(filter).find('h5').text().trim();
					tmp.values = [];
					_.each($(filter).find('a'), function(value){
						tmp.values.push($(value).attr('title'));
					})

					productsJSON.filters.push(tmp);
				});
			});

			/* Product Grid */
			$('.products-list').filter(function(){
        var $data = $(this);
				var productsHTML = $data.find('li');

				_.each(productsHTML, function(product) {
					var tmp = {};
					tmp.url   					= $(product).find('.product_panel a').attr('href');
					tmp.line 						= $(product).find('.prod_name span').text();
					tmp.name  					= $(product).find('.prod_name h6').text();
					tmp.image 					= $(product).find('.product_panel a img').attr('src');
					tmp.price_current 	= $(product).find('.now_price').text().trim();
					tmp.price_original 	= $(product).find('.was_price').text().trim();

					productsJSON.products.push(tmp);
				})
      })
		}

		fs.writeFile('json/product-listing-page.json', JSON.stringify(productsJSON, null, 4), function(err){
    	console.log('File successfully written! - Check your project directory for the output.json file');
    });

    res.send('Check your console!')
	})
});

module.exports = router;
