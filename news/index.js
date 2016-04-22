module.exports = function (context, req) {
    if (!req.query.q) {
        context.res = {
            status: 400,
            body: "Missing query parameter 'q'"
        };
        context.done();
    }

    context.res = {
        status: 200,
        body: req.query.keyword
    };
    
    context.done();
};