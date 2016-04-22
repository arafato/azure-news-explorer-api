/* global Buffer */
var config = require('../lib/config');
var news = require('../lib/newsquery');

/* 
 * req.q is is expected to be encoded as base64. We pass through (and thus support) 
 * the Azure Search query parameters as documented at https://msdn.microsoft.com/en-us/library/azure/dn798927.aspx
 */
module.exports = function (context, req) {
    if (!req.query.q) {
        context.res = {
            status: 400,
            body: "Missing query parameter 'q'"
        };
        context.done();
    }

    var q = new Buffer("req.q", 'base64').toString('utf8');
    news.query(q, function (err, data) {
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
    });
};