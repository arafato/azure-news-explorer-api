var YQL = require("yql");
var _s = require("underscore.string");

var URL = "https://azure.microsoft.com/en-us/blog/topics/announcements/";

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
		var selector = "div.wa-blog-posts-items";
		var yqlstring = _s.sprintf('select * from data.html.cssselect where url="%s" and css="%s"', URL, selector);
		var news = [];

		new YQL.exec(yqlstring, function (response) {
			var results = response.query.results.results.div.article;
			var item;
			for (var i = 0; i < results.length; ++i) {
				item = createItem(results[i].div);
				if (item.timestamp > lowerBound) {
					news.push(item);	
				}
				else {
					break;
				}
			}
			
			cb(JSON.stringify(news));
		});
	}
}