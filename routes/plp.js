var _				    = require('lodash'),
    cheerio     = require('cheerio'),
    express     = require('express'),
    fs 			    = require('fs'),
    request     = require('request');

// var mainUrl = 'http://www.michaelkors.com/handbags/totes/_/N-283j';
var mainUrl = 'http://www.michaelkors.com';

var depts = [
  {
    label: 'women',
    url  : 'http://www.michaelkors.com/trend/new-arrivals/_/N-1ock9ar'
  },
  {
    label: 'handbags',
    url  : 'http://www.michaelkors.com/handbags/view-all-handbags/_/N-283i'
  },
  {
    label: 'shoes',
    url  : 'http://www.michaelkors.com/shoes/view-all-shoes/_/N-28ba'
  },
  {
    label: 'watches',
    url  : 'http://www.michaelkors.com/watches/view-all-watches/_/N-lrsan0'
  },
  {
    label: 'accessories',
    url  : 'http://www.michaelkors.com/accessories/view-all-accessories/_/N-1l604f9'
  },
  {
    label: 'gifts',
    url  : 'http://www.michaelkors.com/gifts/view-all-gifts/_/N-aocq9g'
  },
  {
    label: 'sale',
    url  : 'http://www.michaelkors.com/sale/view-all-sale/_/N-28zn'
  },
]

// define the home page route
exports.index = function(req, res) {

  /* Product Grid */
  var scrapeProducts = function(name, $){
    var productsJSON = [];

    $('.products-list').filter(function(){
      var $data = $(this);

      var $products = $data.find('li');

      _.each($products, function(product) {
        var tmp = {
          url   					: $(product).find('.product_panel a').attr('href')
          brandName 			: $(product).find('.prod_name span').text().toLowerCase()
          productName  		: $(product).find('.prod_name h6').text().toLowerCase()
          image 					: $(product).find('.product_panel a img').attr('src')
          priceCurrent 	  : $(product).find('.now_price').text().trim()
          priceOriginal 	: $(product).find('.was_price').text().trim()
        };

        productsJSON.push(tmp);
      })
    })

    fs.writeFile('json/plp/' + name + '/view-all.json', JSON.stringify(productsJSON, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    });
  }

	_.each(depts, function(dept){
    request(dept.url, function(error, response, html){
      if(!error){
        var $ = cheerio.load(html);

        scrapeProducts(dept.label, $);
      };
		});
	})
};
