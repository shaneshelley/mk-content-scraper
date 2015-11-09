var _				    = require('lodash'),
    express     = require('express'),
    fs 			    = require('fs'),
    requireDir  = require('require-dir'),
    dataSet     = require('../json/dresses/view-all.json'),
    filters     = requireDir('../json/dresses/filters');

var router = express.Router();

// define the home page route
router.get('/', function(req, res) {

  _.each(filters, function(filter) {
    console.log("filter: " + filter.filterLabel);

    _.each(filter.products, function(product){
      console.log("product: " + product.name);

      var match = _.find(dataSet.products, function(item) { return item.name === product.name })
      if (match) {
         console.log('match!');
         if (!match.filters) {
           match.filters = [];
         }
         match.filters.push(filter.filterLabel);
      }
    });
  });

  fs.writeFile('json/dresses/new-view-all.json', JSON.stringify(dataSet, null, 4), function(err){
    console.log('File successfully written! - Check your project directory for the output.json file');
  });
});

module.exports = router;
