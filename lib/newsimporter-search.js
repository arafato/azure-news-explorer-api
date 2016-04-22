/* global Buffer */
var request = require('request');
var AzureSearch = require('azure-search');
var config = require('./config');

var searchClient = AzureSearch({
  url: config.SEARCH_ENDPOINT,
  key: config.SEARCH_API_KEY
});

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
	
	updateNews: function (data, cb) {
		var docs = [];
  		data.forEach(function (i) {
			docs.push({
			'url': new Buffer(i.url).toString('base64'),
			'title': i.title,
			'abstract': i.abstract,
			'timestamp': i.timestamp,
			'date': i.date,
			'tags': i.tags, 
			'author': i.author,
			'authorImage': i.authorImage,
			'authorJobTitle': i.authorJobTitle,
			'authorBlog': i.authorBlog
			});
		}, this);
		
			// We assume that per daily update no more than 1000 documents are added to the index,
			// thus we do not slice the array.	
			searchClient.addDocuments(config.INDEX_NAME, docs, function (err, results) {
				if (err) {
					cb('ERROR WHILE ADDING DOCS: ' + JSON.stringify(err));
				}
				
				cb(null, results.length);
			});
	}
}