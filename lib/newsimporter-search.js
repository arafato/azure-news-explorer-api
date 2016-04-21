var config = require('./config');
var request = require('request');

module.exports = {
	getLowerBoundDate: function (cb) {
		request(
			{ url: config.SEARCH_ENDPOINT + 
			       '/indexes/announcements/docs?api-version=2015-02-28&$top=1&orderby=timestamp desc&$select=timestamp',
			  headers: {
				  'api-key': config.SEARCH_API_KEY
			  }
			}, function(err, response, body) {
				if (err || response.statusCode !== 200) {
					cb("Could not get lower bound date: " + err);
				}
				
				var res = JSON.parse(body);
				cb(null, res.value[0].timestamp);
			});		
	},

	updateNews: function (data, callback) {

	}
}