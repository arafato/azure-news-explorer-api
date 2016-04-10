var s = require('../lib/keywordsearch');

module.exports = function (context, req) {
    if (!req.query.keyword) {
        context.res = {
            status: 400,
            body: "Please pass a keyword as a parameter!"
        };
        context.done();
    }

    s.keywordSearch(req.query.keyword, function (err, data) {
        if (err) {
            context.res = {
                status: 400, 
                body: "Failed to query data: " + JSON.stringify(err)
            }
            context.done();
        }
        
        context.res = {
            status: 200,
            body: JSON.stringify(data)
        };

        context.done();
    });
};