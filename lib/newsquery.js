var request = require('request');
var config = require('./config');

function buildKeywordQueryString(keyword, ordermode, startdate, enddate, skip) {
	var q = "$filter=timestamp ge " + startdate + "and timestamp le " + enddate;
	switch (ordermode) {
		case 2:
			q = q + "&$orderby=timestamp asc";
			break;
		case 3:
			q = q + "&$orderby=timestamp desc";
		default:
			break;
	}

	q = q + '&search=' + keyword;
	q = q + '&$skip=' + skip;
	q = q + '&highlight=abstract';

	return q;
}

function buildHeader(q) {
	return {
		url: config.SEARCH_ENDPOINT + '/indexes/announcements/docs?api-version=2015-02-28&' + q,
		headers: { 'api-key': config.SEARCH_API_KEY }
	}
}

module.exports = {
	rawQuery: function (q, cb) {
		request(buildHeader(q), function (err, response, body) {
			if (err || response.statusCode !== 200) {
				cb('Error in retrieving ressources: ' + JSON.stringify(err));
			}

			cb(null, body);
		});
	},
	
	/*
	*	ordermode: 1=score, 2=asc, 3=desc
	*/
	keywordQuery: function (keyword, ordermode, startdate, enddate, skip, cb) {
		ordermode = ordermode || 3;
		startdate = startdate || 1199224800; // Azure Birthday
		enddate = enddate || (Date.now() / 1000 | 0);
		skip = skip || 0;

		var q = buildKeywordQueryString(keyword, ordermode, startdate, enddate, skip);
		request(buildHeader(q), function (err, response, body) {
			if (err || response.statusCode !== 200) {
				cb('Error in retrieving ressources: ' + JSON.stringify(err));
			}

			cb(null, body);
		});
	}
}