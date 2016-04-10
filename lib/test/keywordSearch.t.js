var expect = require("chai").expect;
var s = require("../keywordsearch");

describe("Keyword Search", function () {
  describe("Search for webjobs", function () {
    it("it will get 7 results", function (done) {
      this.timeout(10000);
      s.keywordSearch("webjobs", function (err, data) {
        console.log(JSON.stringify(data));
        expect(data).lengthOf(7);
        done();
      });
    });
  });
});