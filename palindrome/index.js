module.exports = function (context, req) {

	if (!req.query.txt) {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body!"
        };
        context.done();
    }

    var txt = req.query.txt;
    txt = txt.split('');
    txt = txt.reverse();
    txt = txt.join('');
    txt = txt.replace(/\s+/g, '').toLowerCase();

    context.res = {
		status: 200,
		body: txt === req.query.txt.toLowerCase().replace(/\s+/g, '')
	};

    context.done();
};