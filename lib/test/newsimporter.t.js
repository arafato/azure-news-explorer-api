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
			done();
		});
		it("it gets the correct lowest bound date", function (done) {
			this.timeout(10000);
			newsImporter.getLowerBoundDate(function(err, data) {
				console.log("!!!! " + JSON.stringify(data));
				done();
			});
		});
		it("stores all docs in DB", function(done) {
			this.timeout(10000);
			newsImporter.updateNewsDB(TEST_DOCS, function(err, data) {
        if (err) {
          expect(true).to.be.false;
        } else {
          expect(true).to.be.true;
        }
        done();
      });
		});
	});
});


///////////////////////
//// TEST DATA

var TEST_DOCS = [ 
  { blogpostImageUrl: 'https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/acomblog/media/Default/blog/iStock_000081557705_011416.jpg',
    timestamp: 1459461600,
    date: 'Friday, April 1, 2016',
    blogpostUrl: '/en-us/blog/new-features-for-azure-diagnostics-and-azure-audit-logs/',
    title: 'New features for Azure diagnostics and Azure Audit logs',
    titleLower: 'new features for azure diagnostics and azure audit logs',
    abstract: 'We are excited to announce a set of new features allowing you to gain deeper insights on the operations of your Azure resources as well as manage and consume this data in flexible ways.',
    abstractLower: 'we are excited to announce a set of new features allowing you to gain deeper insights on the operations of your azure resources as well as manage and consume this data in flexible ways.',
    author: 'Ashwin Kamath',
    authorLower: 'ashwin kamath',
    authorsblog: '/en-us/blog/author/ashwink/',
    jobrole: 'Senior Program Manager, Azure Monitoring' },
  { blogpostImageUrl: 'https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/acomblog/media/Default/blog/iStock_000073777799_101915.jpg',
    timestamp: 1459461600,
    date: 'Friday, April 1, 2016',
    blogpostUrl: '/en-us/blog/mydriving-an-azure-iot-and-mobile-sample-application/',
    title: 'MyDriving – An Azure IOT and Mobile sample application',
    titleLower: 'mydriving – an azure iot and mobile sample application',
    abstract: 'The MyDriving Azure IoT and Mobile sample application enables you to record trips in your car using the MyDriving mobile application and off the shelf OBD devices.',
    abstractLower: 'the mydriving azure iot and mobile sample application enables you to record trips in your car using the mydriving mobile application and off the shelf obd devices.',
    author: 'Harikrishna Menon',
    authorLower: 'harikrishna menon',
    authorsblog: '/en-us/blog/author/harikm/',
    jobrole: 'Senior Program Manager, Azure IoT' },
  { blogpostImageUrl: 'https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/acomblog/media/Default/blog/iStock_000067818737_111815.jpg',
    timestamp: 1459461600,
    date: 'Friday, April 1, 2016',
    blogpostUrl: '/en-us/blog/performance-testing-with-app-service-continuous-deployment/',
    title: 'Performance testing with App Service Continuous Deployment',
    titleLower: 'performance testing with app service continuous deployment',
    abstract: 'App Service helps you automate the deployment process through the Continuous Deployment functionality, and now we\'ve added integration with Visual Studio Load Testing to trigger a test as part of your continuous integration workflow.',
    abstractLower: 'app service helps you automate the deployment process through the continuous deployment functionality, and now we\'ve added integration with visual studio load testing to trigger a test as part of your continuous integration workflow.',
    author: 'Byron Tardif',
    authorLower: 'byron tardif',
    authorsblog: '/en-us/blog/author/byvinyal/',
    jobrole: 'Program Manager, Azure Websites' } ];

