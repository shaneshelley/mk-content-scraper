var _				= require('lodash'),
    cheerio = require('cheerio'),
    express = require('express'),
    fs 			= require('fs'),
    request = require('request');

var router      = express.Router();

var URL         = 'http://localhost:3000/';
var scrapePage  = 'sale';

// define the home page route
router.get('/', function(req, res) {
  var url = URL + scrapePage;

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var promosJSON = { promos: [] };

			$('.container').filter(function(){
        var $data = $(this);

				var promosHTML = $data.find('.promo');

				_.each(promosHTML, function(promo) {
					var tmp = {}

					tmp.style = $(promo).attr('class');
					tmp.url 	= '#';
					tmp.image = $(promo).find('img').attr('src');

          // caption(s)
          tmp.captions = [];
          _.each($(promo).find('.caption'), function(caption, i){

            var tmpCaption = {};
            tmpCaption.style     = $(caption).attr('class');
						tmpCaption.slugText	 = $(caption).find('.slug').html();

            // headline
            tmpCaption.headline = {
              style: $(caption).find('.headline').attr('class')
            };

            tmpCaption.headline.rows = []
            _.each($(caption).find('.headline span'), function(row, i) {
              tmpCaption.headline.rows[i] = $(row).html();
            });

            tmpCaption.text = $(caption).find('.text').html();

            if (tmpCaption.text !== null) {
              tmpCaption.text = tmpCaption.text.replace(/\r?\n|\r/g, '');
            }

            // cta(s)
            tmpCaption.cta = [];
            _.each($(caption).find('.cta li'), function(cta, i) {
              var tmpCta = $(cta).find('a').text();

              tmpCaption.cta.push(tmpCta);
            });

            tmp.captions.push(tmpCaption);
          });

					promosJSON.promos.push(tmp);
				})
      })
		}

    var filename = "json/" + scrapePage + ".json";

		fs.writeFile(filename, JSON.stringify(promosJSON, null, 4), function(err){
    	console.log('File successfully written! - Check your project directory for the output.json file');
    });

    res.send('Check your console!')
	})
});

module.exports = router;
