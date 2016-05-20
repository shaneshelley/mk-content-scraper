var _				    = require('lodash'),
    cheerio     = require('cheerio'),
    express     = require('express'),
    fs 			    = require('fs'),
    request     = require('request');

var mainUrl = 'http://www.michaelkors.com/handbags/totes/_/N-283j';

exports.index = function(req, res) {
  request(mainUrl, function(error, response, html){
    var categoryNavJSON = {
      shops: [],
      categories: []
    };

		if(!error){
			var $ = cheerio.load(html);

      /* Shops */
      $('.category_container').filter(function(){
        var $data = $(this);

        console.log($data);
        var shops = $data.find('.trends_list a')

        console.log("how many shops? " + $(shops).length);
        _.each(shops, function(shop){
          var tmp = {};

          tmp.label = $(shop).text().toLowerCase();
          tmp.url   = $(shop).attr('href');

          categoryNavJSON.shops.push(tmp);
        });


			  /* Categories */
			  var categoryHTML = $data.find('.category_list .subcategory');

        console.log("how many categories? " + $(categoryHTML).length);

				var categories = []

        _.each(categoryHTML, function(category) {
          var cat = {};

          cat.label = $(category).find('a').attr('title').toLowerCase();
          cat.url   = $(category).find('a').attr('href');

          if ($(category).attr('id') === 'subcat_submenu') {
            var subcatHTML = $(category).find('a');

            cat.subcategories = [];

            _.each(subcatHTML, function(subcategory){
              var subcat = {};

              subcat.label = $(subcategory).attr('title').toLowerCase();
              subcat.url   = $(subcategory).attr('href');

              cat.subcategories.push(subcat);
            })
          }

					categoryNavJSON.categories.push(cat);
				});
      });

      fs.writeFile('json/categories/handbags.json', JSON.stringify(categoryNavJSON, null, 4), function(err){
      	console.log('File successfully written! - Check your project directory for the output.json file');
      });
    }
	})
};
