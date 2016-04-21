var sprintf = require("sprintf-js").sprintf;
var asyncLoop = require('./utils').asyncLoop;
var request = require('request');

var YQL_TEMPLATE = 'http://query.yahooapis.com/v1/public/yql?format=json&env=http://datatables.org/alltables.env&q=select * from data.html.cssselect where url="%s" and css="%s"';
var SELECTOR = "div.blog-posts.column";
var URL = "https://azure.microsoft.com/en-us/blog/?page=%s";

var YQL_QUERY = sprintf(YQL_TEMPLATE, URL, SELECTOR);

function createItem(d) {
	var tagsRaw = d.div[2].a,
		tags = [];
	if(tagsRaw instanceof Array) {
		var tags = tagsRaw.map(function(i) { return i.content; }); 
	} else if (d.div[2].a){
		tags.push(d.div[2].a.content);	
	} else {
		tags.push("Other");
	}
	
	var jobtitle = (d.div[1].div[1].span === undefined) ? 'N/A' : d.div[1].div[1].span.content; 
	
	return {
		url: 'https://azure.microsoft.com' + d.h3.a.href,
		title: d.h3.a.title,
		abstract: d.p[1],
		author: d.div[1].div[1].a.content,
		authorImage: d.div[1].div[0].img.src,
		authorJobTitle: jobtitle,
		authorBlog: 'https://azure.microsoft.com' + d.div[1].div[1].a.href,
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
			request(sprintf(YQL_QUERY, loop.iteration() + 1), function(error, response, body) {
				if (error || response.statusCode != 200) {
					loop.next();
         	   		loop.setIteration(loop.iteration() - 1);
        		} else {
					
					var body = JSON.parse(response.body);

					// There was an error fetching data... retry
					if (body.query.results.results === null) {
						loop.next();
         	   			loop.setIteration(loop.iteration() - 1);
					}
					if (body.query.results.results.div.h3 === 'No blog posts were found.') {
						loop.next();
         	   			loop.setIteration(loop.iteration() - 1);
					}

					var results = body.query.results.results.div.article,
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