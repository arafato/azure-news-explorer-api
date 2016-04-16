var DocumentClient = require('documentdb').DocumentClient;
var async = require('async');
var config = require('./config').Config;

var ddb = new DocumentClient(config.DOCUMENTDB_ENDPOINT, { masterKey: config.DOCUMENTDB_KEY });

module.exports = {
	getLowerBoundDate: function (cb) {
		var query = "SELECT TOP 1 News.timestamp FROM News ORDER BY News.timestamp desc";
		ddb.queryDocuments(config.DDB_LINK, query).toArray(function (err, data) {
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
				ddb.createDocument(config.DDB_LINK, item, function (err, doc) {
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