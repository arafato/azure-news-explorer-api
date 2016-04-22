module.exports = function (context, req) {
    if (!req.query.keyword) {
        context.res = {
            status: 400,
            body: "Please pass a keyword as a parameter!"
        };
        context.done();
    }

    context.res = {
        status: 200,
        body: req.query.keyword
    };
};