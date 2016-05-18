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
			var productJSON = {};

			/* Product Grid */
			$('.pdp_main_container').filter(function(){
        var $data = $(this);
				var productsHTML = $data.find('li');

        productJSON.brandName   = $(this).find('.brand_name').text();
        productJSON.productName = $(this).find('.prod_name').text();
        productJSON.storeStyle  = $(this).find('#store_number').text();

        productJSON.description = [
          {
            sectionName     : "Style Notes",
            sectionContent  : $(this).find('.pdp_description_tabs_1').text();
          },

          {
            sectionName     : "Details",
            sectionContent  : $(this).find('.pdp_description_tabs_2').text();
          }

        ]

      })
		}

		fs.writeFile('json/pdp/handbags/totes/tote.json', JSON.stringify(productJSON, null, 4), function(err){
    	console.log('File successfully written! - Check your project directory for the output.json file');
    });

    res.send('Check your console!')
	})
});

module.exports = router;
