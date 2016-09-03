'use strict'

let sprintf = require("sprintf-js").sprintf;
let asyncLoop = require('./utils').asyncLoop;
let request = require('request');
let XRay = require('x-ray');
let x = XRay();

let retryCounter = 0;

var URL = "https://azure.microsoft.com/en-us/blog/?page=%s";

function createItem(d) {
	d.timestamp = new Date(d.date).getTime() / 1000;
	return d;
}

module.exports = {
	getMostRecentNews: function (lowerBound, cb) {
		lowerBound = (lowerBound === null) ? 1199224800 : lowerBound;
		let news = [];

		// We run until we hit the magic date 'Monday, October 27, 2008' or hit the lower bound date
		asyncLoop(1000, function (loop) {
			x(sprintf(URL, loop.iteration() + 1), '.blog-postItem', [{
				title: 'h3',
				url: 'h3 > a@href',
				date: 'span.text-slate07',
				authorImage: '.blog-author .image img@src',
				author: '.name.with-position a',
				authorJobTitle: '.name.with-position .position',
				abstract: 'p:nth-of-type(2)',
				tags: x('.blog-topicLabels', ['a'])
			}])(function (err, items) {
				if (err && retryCounter < 3) {
					// Retry in case of an error
					++retryCounter;
					loop.next();
					loop.setIteration(loop.iteration() - 1);
				}
				retryCounter = 0;

				for (let i = 0; i < items.length; ++i) {
					let item = createItem(items[i]);
					if (item.timestamp > lowerBound) {
						news.push(item);
						console.log(item);
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
		}, function () {
			cb(news);
		});
	}
}
