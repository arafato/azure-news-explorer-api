var YQL = require("yql");
var _s = require("underscore.string");
var asyncLoop = require('./utils').asyncLoop;

var yqlstring = 'select * from data.html.cssselect where url="%s" and css="%s"';
var SELECTOR = "div.wa-blog-posts-items";
var URL = "https://azure.microsoft.com/en-us/blog/topics/announcements/?page=%s";

yqlstring = _s.sprintf(yqlstring, URL, SELECTOR);

function createItem(d) {
	return {
		blogpostImageUrl: d[0].img.src,
		timestamp: new Date(d[1].span.content).getTime() / 1000,
		date: d[1].span.content,
		blogpostUrl: d[1].h3.a.href,
		title: d[1].h3.a.title,
		abstract: d[1].p,
		author: d[1].div.a.content,
		authorsblog: d[1].div.a.href,
		jobrole: d[1].div.span.content
	};
}


module.exports = {

	getMostRecentNews: function (lowerBound, cb) {
		var selector = "div.wa-blog-posts-items",
			yqlstring = _s.sprintf('select * from data.html.cssselect where url="%s" and css="%s"', URL, selector),
			news = [];

		// We run until we hit the magic date 'Monday, October 27, 2008' or hit the lower bound date
		asyncLoop(1000, function(loop) {
			new YQL.exec(_s.sprintf(yqlstring, loop.iteration()+1), function (response) {
				
				var results = response.query.results.results.div.article,
					item;
					
				for (var i = 0; i < results.length; ++i) {
					item = createItem(results[i].div);

					if (item.timestamp > lowerBound) {
						news.push(item);
					} else {
						loop.break();
						break;
					}
					
					if (item.date === 'Monday, October 27, 2008') {
						loop.break();
						break;
					}
				}
				loop.next();
			});
		}, function() {
			cb(news);
		})
	}
}