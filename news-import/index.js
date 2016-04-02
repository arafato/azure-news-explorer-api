module.exports = function (context, myTimer) {

    var timeStamp = new Date().toISOString();

    context.bindings.document = {
        timestamp: timeStamp,
        text: "foobar"
    };

    context.done();
};