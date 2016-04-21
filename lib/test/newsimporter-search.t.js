var expect = require("chai").expect;
var s = require("../newsimporter-search");

describe("News Import", function () {
  describe("Lower Bound Date", function () {
    it("it will get a valid lowest bound date", function (done) {
      this.timeout(10000);
      s.getLowerBoundDate(function(err, date) {
        expect(err).to.be.null;
        console.log(date);
        done();
      })
    });
  });
});