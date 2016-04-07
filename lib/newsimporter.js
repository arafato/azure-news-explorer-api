var YQL = require("yql");
var _s = require("underscore.string");
var DocumentClient = require('documentdb').DocumentClient;
var async = require('async');
var asyncLoop = require('./utils').asyncLoop;
var config = require('./config').Config;

var yqlstring = 'select * from data.html.cssselect where url="%s" and css="%s"';
var SELECTOR = "div.wa-blog-posts-items";
var URL = "https://azure.microsoft.com/en-us/blog/topics/announcements/?page=%s";
var DDB_LINK = "dbs/-+5lAA==/colls/-+5lAJM2EQA=/";

yqlstring = _s.sprintf(yqlstring, URL, SELECTOR);

var ddb = new DocumentClient(config.DOCUMENTDB_ENDPOINT, { masterKey: config.DOCUMENTDB_KEY });

function createItem(d) {
	return {
		blogpostImageUrl: d[0].img.src,
		timestamp: new Date(d[1].span.content).getTime() / 1000,
		date: d[1].span.content,
		blogpostUrl: d[1].h3.a.href,
		title: d[1].h3.a.title,
		titleLower: d[1].h3.a.title.toLowerCase(),
		abstract: d[1].p,
		abstractLower: d[1].p.toLowerCase(),
		author: d[1].div.a.content,
		authorLower: d[1].div.a.content.toLowerCase(),
		authorsblog: d[1].div.a.href,
		jobrole: d[1].div.span.content
	};
}


module.exports = {
	getMostRecentNews: function (lowerBound, cb) {
		lowerBound = (lowerBound === null) ? 1199224800 : lowerBound;
		var	yqlstring = _s.sprintf('select * from data.html.cssselect where url="%s" and css="%s"', URL, SELECTOR),
			news = [];

		// We run until we hit the magic date 'Monday, October 27, 2008' or hit the lower bound date
		asyncLoop(1000, function (loop) {
			new YQL.exec(_s.sprintf(yqlstring, loop.iteration() + 1), function (response) {
				if (response.query.results.results === null) {
					loop.setIteration(loop.iteration() - 1);
					loop.next();
				} else {
					var results = response.query.results.results.div.article,
						item;

					for (var i = 0; i < results.length; ++i) {

						item = createItem(results[i].div);

						if (item.timestamp > lowerBound) {
							news.push(item);
						} else {
							loop.break();
							break;
						}

						if (item.date === 'Monday, October 27, 2008') {
							loop.break();
							break;
						}
					}
					loop.next();
				}
			});
		}, function () {
			cb(news);
		})
	},

	getLowerBoundDate: function (cb) {
		var query = "SELECT TOP 1 News.timestamp FROM News ORDER BY News.timestamp desc";
		ddb.queryDocuments(DDB_LINK, query).toArray(function (err, data) {
			if (err) {
				cb(err);
			}
			// If DB is empty the lower bound is set to 1/1/2008 resulting in a full import of all announcements
			var lowerBoundDate = (data.length === 0) ? 1199224800 : data[0].timestamp;
			cb(null, lowerBoundDate);
		});
	},

	updateNewsDB: function (data, callback) {
		var funcs = [];
		data.forEach(function (item) {
			funcs.push(function (cb) {
				ddb.createDocument(DDB_LINK, item, function (err, doc) {
					if (err) {
						cb(err);
					}
					cb(null, doc.content);
				});
			});
		});
		async.parallel(funcs, function (err, result) {
			if (err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	}
}