var webscraper = require('../lib/webscraper');
var newsImporter = require('../lib/newsimporter-documentdb');

module.exports = function (context, myTimer) {

    newsImporter.getLowerBoundDate(function (err, date) {
        if (err) {
            context.log("ERROR in getLowerBound: " + JSON.stringify(err));
            context.done(err);
        }

        webscraper.getMostRecentNews(date, function (data) {
            newsImporter.updateNews(data, function (err, data) {
                if (err) {
                    context.log("ERROR in updateNewsDB: " + JSON.stringify(err));
                    context.done(err);
                }
                
                context.log("Update successful!");
                context.done();
            });
        });
    });
};