var _				= require('lodash'),
    cheerio = require('cheerio'),
    express = require('express'),
    fs 			= require('fs'),
    request = require('request');

var url = 'http://www.michaelkors.com/jet-set-large-top-zip-saffiano-leather-tote/_/R-US_30F4GTTT9L?No=-1&color=1161';

exports.index = function(req, res) {
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
            sectionContent  : $(this).find('.pdp_description_tabs_1').text()
          },

          {
            sectionName     : "Details",
            sectionContent  : $(this).find('.pdp_description_tabs_2').text()
          }

        ];

        productJSON.options = [];

        if ($(this).find('.product_color_labels')) {
          var option = {
            optionName : 'Color',
            options    : []
          }
          _.each($(this).find('.color_group_list li a'), function(color){
            option.options.push($(color).find('img').attr('src'));
          });

          productJSON.options.push(option);
        }

        productJSON.price = $(this).find('#productPriceinfo .price').text();
      });
		}

    console.log(JSON.stringify(productJSON));

		fs.writeFile('json/pdp/handbags/tote.json', JSON.stringify(productJSON, null, 4), function(err){
    	console.log('File successfully written! - Check your project directory for the output.json file');
    });

    res.send('Check your console!')
	})
};
