var request = require('request');
var config = require('./config');

module.exports = {
	query: function (q, cb) {
		var headers = {
			url: config.SEARCH_ENDPOINT + '/indexes/announcements/docs?api-version=2015-02-28&' + q,
			headers: { 'api-key': config.SEARCH_API_KEY }
		}

		request(headers, function (err, response, body) {
			if (err || response.statusCode !== 200) {
            	cb('Error in retrieving ressources: ' + JSON.stringify(err));
			}
			
			cb(null, body);
		});
	}
}