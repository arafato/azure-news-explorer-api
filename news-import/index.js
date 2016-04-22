var webscraper = require('../lib/webscraper');
var newsImporter = require('../lib/newsimporter-search');

module.exports = function (context, myTimer) {

    newsImporter.getLowerBoundDate(function (err, date) {
        if (err) {
            context.log("ERROR in getLowerBound: " + JSON.stringify(err));
            context.done(err);
            return;
        }
        context.log("Got lower bound date: " + date);
        webscraper.getMostRecentNews(date, function (data) {
            context.log("About to insert following news: " + JSON.stringify(data));
            newsImporter.updateNews(data, function (err, data) {
                if (err) {
                    context.log("ERROR in updateNewsDB: " + JSON.stringify(err));
                    context.done(err);
                    return;
                }
                
                context.log("Update successful!");
                context.done();
            });
        });
    });
};