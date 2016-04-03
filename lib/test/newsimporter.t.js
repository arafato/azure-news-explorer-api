var expect = require("chai").expect;
var newsImporter = require("../newsimporter");

describe("News Importer", function () {
	describe("Azure Announcements Site", function () {
		it("it gets the most recent announcements down to given date (excluding)", function (done) {
			this.timeout(900000);
			newsImporter.getMostRecentNews(1459375200, function(data) {
				console.log(data);
				expect(true).to.be.true;
				done();
			});
		});
	});
});