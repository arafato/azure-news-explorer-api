var expect = require("chai").expect;
var q = require("../newsquery");

describe("News Query", function () {
  describe("Simple query", function () {
    it("it will get a number of news without error", function (done) {
      this.timeout(10000);
      q.query('search=api management&$orderby=timestamp desc&$top=5', function(err, data) {
        expect(err).to.be.null;
        console.log(data);
        done();
      })
    });
  });
});