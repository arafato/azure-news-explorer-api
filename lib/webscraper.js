var sprintf = require("sprintf-js").sprintf;
var asyncLoop = require('./utils').asyncLoop;
var YQL = require('yql');

var YQL_TEMPLATE = 'select * from data.html.cssselect where url="%s" and css="%s"';
var SELECTOR = "div.blog-posts.column";
var URL = "https://azure.microsoft.com/en-us/blog/topics/announcements/?page=%s";

var YQL_QUERY = sprintf("%s%s%s", YQL_TEMPLATE, URL, SELECTOR);

function createItem(d) {
	var tagsRaw = d.div[2].a,
		tags = [];
	if(tagsRaw instanceof Array) {
		var tags = tagsRaw.map(function(i) { return i.content; }); 
	} else {
		tags.push(d.div[2].a.content);	
	}
	
	return {
		url: 'https://azure.microsoft.com' + d.h3.a.href,
		title: d.h3.a.title,
		abstract: d.p[1],
		author: d.div[1].div[1].a.content,
		date: d.p[0].span.content,
		timestamp: new Date(d.p[0].span.content).getTime() / 1000,
		tags: tags  		
	};
}

module.exports = {
	getMostRecentNews: function (lowerBound, cb) {
		lowerBound = (lowerBound === null) ? 1199224800 : lowerBound;
		var	news = [];

		// We run until we hit the magic date 'Monday, October 27, 2008' or hit the lower bound date
		asyncLoop(1000, function (loop) {
			new YQL.exec(_s.sprintf(YQL_QUERY, loop.iteration() + 1), function (response) {
				if (response.query.results.results === null) {
					loop.setIteration(loop.iteration() - 1);
					loop.next();
				} else {
					
					var results = response.query.results.results.div.article,
						item;

					for (var i = 0; i < results.length; ++i) {

						item = createItem(results[i]);

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
				}
			});
		}, function () {
			cb(news);
		});
	}
}