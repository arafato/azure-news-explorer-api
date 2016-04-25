var expect = require("chai").expect;
var q = require("../newsquery");

describe("News Query", function () {
  describe("Raw query", function () {
    it("it will get a number of news without error", function (done) {
      this.timeout(10000);
      q.rawQuery('search=api management&$orderby=timestamp desc&$top=5', function(err, data) {
        expect(err).to.be.null;
        console.log(data);
        done();
      })
    });
  });
  describe("Keyword query", function () {
    it("it will fetch news without an error", function(done) {
      this.timeout(10000);
      q.keywordQuery("api management", 3, 1454284800, 1455062400, 0, function(err, data) {
        expect(err).to.be.null;
        console.log(data);
        done();
      });
    });
  });
});