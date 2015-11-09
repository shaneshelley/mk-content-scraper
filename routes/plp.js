var _				= require('lodash'),
    cheerio = require('cheerio'),
    express = require('express'),
    fs 			= require('fs'),
    request = require('request');

var router = express.Router();

// define the home page route
router.get('/', function(req, res) {
  // View all bags
	var mainUrl = 'http://www.michaelkors.com/women/michael-michael-kors-clothing/dresses/_/N-28ei';

  /* Product Grid */
  var scrapeProducts = function(name, $){
    console.log("name: " + name);
    var productsJSON = {
      products		: []
    };

    $('.products-list').filter(function(){
      var $data = $(this);
      var productsHTML = $data.find('li');

      productsJSON.filterLabel = name;

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

    fs.writeFile('json/dresses/filters/' + name + '.json', JSON.stringify(productsJSON, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    });
  }


	request(mainUrl, function(error, response, html){
    var navJSON = {
      categories: [],
      filters  : []
    }

		if(!error){
			var $ = cheerio.load(html);

			/* Categories */
			$('.category_list').filter(function(){
        var $data = $(this);
				var categoryHTML = $data.find('a');

				var categories = []
				_.each(categoryHTML, function(category) {
					navJSON.categories.push($(category).attr('title'));
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
            var valueObj = {}
            valueObj.label = $(value).attr('title');
            valueObj.url   = $(value).attr('href')
						tmp.values.push(valueObj);

            // get filter products
            request(valueObj.url, function(error, response, html){
              if (!error) {
                var $$ = cheerio.load(html);

              }
            });
					})

					navJSON.filters.push(tmp);
				});
			});

      fs.writeFile('json/plp-dresses-nav.json', JSON.stringify(navJSON, null, 4), function(err){
      	console.log('File successfully written! - Check your project directory for the output.json file');
      });

      // get all products
			scrapeProducts('view-all', $);
		}

		res.send('Check your console!')
	})
});

module.exports = router;
