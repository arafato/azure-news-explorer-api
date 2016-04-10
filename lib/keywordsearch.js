var DocumentClient = require('documentdb').DocumentClient;
var config = require('./config').Config;

var ddb = new DocumentClient(config.DOCUMENTDB_ENDPOINT, { masterKey: config.DOCUMENTDB_KEY });

module.exports = {
	keywordSearch: function(keyword, cb) {
		var query = "SELECT * FROM News where contains(News.titleLower, '" + keyword + "')";
		ddb.queryDocuments(config.DDB_LINK, query).toArray(function(err, data) {
			if (err) {
				cb(err);
			}
			
			cb(null, data);
		});
	}
}