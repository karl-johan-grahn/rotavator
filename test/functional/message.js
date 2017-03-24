"use strict";

// Force the test environment to "test"
process.env.NODE_ENV = "test";

// Get the application server
var app = require("../../server");
var config = require("../../config");
var assert = require("assert");
/**var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);*/

// Use zombie.js as headless browser
var Browser = require("zombie");
var url = "http://localhost:" + config.web.port;
var browser = new Browser();

describe("Index page", function() {

  before(function() {
    // initialize the browser using the same port as the test application
    browser = new Browser({site: url});
  });

  // Load the index page
  before(function(done) {
    browser.visit("/index.html", done);
  });

  it("should show a message form", function() {
    assert.ok(browser.success);
    assert.equal(browser.text("h2"), "Messages");
  });

  it("should have a new button", function() {
    assert.ok(browser.success);
    assert.equal(browser.text("button"), "New");
  });

  it("should refuse empty submissions");
  it("should refuse partial submissions");
  it("should keep values on partial submissions");
  it("should accept complete submissions");
});

/**describe("API", function() {
  describe('/GET messages', () => {
    it('should GET all the messages', (done) => {
      chai.request(app)
          .get('/messages')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
          });
    });
  });
  describe('/POST messages', () => {
    it('should POST a book ', (done) => {
      let message = {
        _id: "234908234203",
        text: "sample text",
        isPalindrome: false,
      }
      chai.request(server)
          .post('/messages')
          .send(message)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('text').eql('sample text');
            res.body.book.should.have.property('isPalindrome');
            res.body.book.should.have.property('_id');
            done();
          });
    });
  });
});*/