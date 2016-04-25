/* global Buffer */
var config = require('../lib/config');
var news = require('../lib/newsquery');

function handleResult(context, err, data) {
    if (err) {
        context.res = {
            status: 400,
            body: JSON.stringify(err)
        };
        context.done();
    }

    context.res = {
        status: 200,
        body: data
    };

    context.done();
}

/* 
 * req.q is is expected to be encoded as base64. We pass through (and thus support) 
 * the Azure Search query parameters as documented at https://msdn.microsoft.com/en-us/library/azure/dn798927.aspx
 */
module.exports = function (context, req) {
    if (!req.query.q && !req.query.keyword) {
        context.res = {
            status: 400,
            body: "Missing query parameter 'q' or 'keyword'"
        };
        context.done();
    }

    if (req.query.q) {
        var q = new Buffer(req.query.q, 'base64').toString('utf8');
        news.rawQuery(q, function (err, data) {
            handleResult(context, err, data);
        });
    }

    if (req.query.keyword) {
        news.keywordQuery(req.query.keyword, req.query.ordermode, req.query.startdate, req.query.enddate, req.query.skip, function (err, data) {
            handleResult(context, err, data);
        })
    }
};