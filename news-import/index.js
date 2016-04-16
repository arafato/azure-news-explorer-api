var newsImporter = require('../lib/newsimporter-documentdb');

module.exports = function (context, myTimer) {

    newsImporter.getLowerBoundDate(function (err, date) {
        if (err) {
            context.log("ERROR in getLowerBound: " + JSON.stringify(err));
            context.done(err);
        }

        newsImporter.getMostRecentNews(date, function (data) {
            newsImporter.updateNewsDB(data, function (err, data) {
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