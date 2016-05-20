var _				    = require('lodash'),
    cheerio     = require('cheerio'),
    express     = require('express'),
    fs 			    = require('fs'),
    request     = require('request');

var mainUrl = 'http://www.michaelkors.com/handbags/totes/_/N-283j ';

// define the home page route
exports.index = function(req, res) {


  /* Product Grid */
  var scrapeProducts = function(name, $){
    var productsJSON = [];

    $('.products-list').filter(function(){
      var $data = $(this);

      var productsHTML = $data.find('li');
      console.log(productsHTML);
      _.each(productsHTML, function(product) {
        var tmp = {};
        tmp.url   					= $(product).find('.product_panel a').attr('href');
        tmp.brandName 			= $(product).find('.prod_name span').text().toLowerCase();
        tmp.productName  		= $(product).find('.prod_name h6').text().toLowerCase();
        tmp.image 					= $(product).find('.product_panel a img').attr('src');
        tmp.priceCurrent 	  = $(product).find('.now_price').text().trim();
        tmp.priceOriginal 	= $(product).find('.was_price').text().trim();
        productsJSON.push(tmp);
      })
    })

    fs.writeFile('json/plp/handbags/' + name + '.json', JSON.stringify(productsJSON, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    });
  }

	request(mainUrl, function(error, response, html){
    if(!error){
			var $ = cheerio.load(html);
      scrapeProducts('totes', $);
		}
	})
};
