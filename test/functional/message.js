"use strict";

// Force the test environment to "test"
process.env.NODE_ENV = "test";

// Get the application server
var app = require("../../server");
var config = require("../../config");
var mongodb = require("mongodb");

var assert = require("assert");

// Use zombie.js as headless browser
var Browser = require("zombie");
var url = "http://localhost:" + config.web.port;
var browser = new Browser();

describe("On starting the server, the home page", function() {

  before(function() {
    // Initialize the browser using the same port as the test application
    browser = new Browser({site: url});
  });

  // Fully load the home page before continuing the tests
  before(function(done) {
    browser.visit("/index.html", done);
  });

  it("should show a heading and a button for creating new messages, but not a form for new message yet since the button has not been pressed yet", function() {
    assert.ok(browser.success);
    assert.equal(browser.text("h2"), "Messages");
    assert.equal(browser.text("button"), "New");
    browser.assert.elements("button[class*=\"btn-primary\"]", 0);
  });

  it("should show an empty input form and a button for creating a new message after having clicked the button for creating a new message", function(done) {
    browser.pressButton("New").then(function() {
      assert.ok(browser.success);
      assert.equal(browser.text("input[name=\"message-message\"]"), "");
      assert.equal(browser.text("button[class*=\"btn-primary\"]"), "Create");
    }).then(done, done);
  });

  /**it("should allow to post new messages", function(done) {
    browser.fill("input[name=\"message-message\"]", "rotavator");
    browser.pressButton("Create").then(function() {
      assert.ok(browser.success);
      assert.equal(browser.text("li[class=\"list-group-item\"]:nth-last-child(1)"), "rotavator");
    }).then(done, done);
  });*/
});

var supertest = require("supertest");
var should = require("should");
var async = require("async");

var server = supertest.agent(url);
var ObjectID = mongodb.ObjectID;

describe("Messages API", function() {

  var db;
  var test_message_id = new ObjectID();
  var test_message_text = "test message";
  var test_message_isPalindrome = false;

  before(function(done) {
    mongodb.MongoClient.connect(config.db.uri, function(err, database) {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      // Save database object from the callback for reuse
      db = database;

      let test_messages = [{
            _id: test_message_id,
            text: test_message_text,
            isPalindrome: test_message_isPalindrome
          },{
            text: "rotavator",
            isPalindrome: true
          },{
            text: "test message2",
            isPalindrome: false
          }];
      // Remove all documents from collection
      database.collection(config.db.MESSAGES_COLLECTION).remove({}, function(err, numberRemoved) {
        // Populate database with test messages
        database.collection(config.db.MESSAGES_COLLECTION).insertMany(test_messages, function(err, docs) {
          assert.equal(null, err);
          assert.equal(3, docs.insertedCount);
        });
      });
      done();
    });
  });

  describe("wrong route", function() {
    it("should return 404 Not Found", function(done) {
      server
      .get("/random")
      .expect(404)
      .end(function(err, res) {
        res.status.should.equal(404);
        done();
      });
    });
  });

  describe("/POST message", function() {
    it("should post a message", function(done) {
      let message = { text: "post a new message" };
      server
      .post("/messages")
      .send(message)
      .expect("Content-type", /json/)
      .expect(201)
      .end(function(err, res) {
        res.status.should.equal(201);
        res.body.should.have.property("text").eql("post a new message");
        res.body.should.have.property("isPalindrome").eql(false);
        done();
      });
    });
  });

  describe("/GET messages", function() {
    it("should return all messages as an array", function(done) {
      server
      .get("/messages")
      .expect("Content-type", /json/)
      .expect(200)
      .end(function(err, res) {
        res.status.should.equal(200);
        res.body.should.be.instanceof(Array);
        done();
      });
    });
  });

  describe("/GET message", function() {
    it("should return the details of a specific message", function(done) {
      server
      .get("/messages/" + test_message_id)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function(err, res) {
        res.status.should.equal(200);
        res.body.should.have.property("text").eql(test_message_text);
        res.body.should.have.property("isPalindrome").eql(test_message_isPalindrome);
        done();
      });
    });
  });

  describe("/DELETE message", function() {
    it("should delete a specific message", function(done) {
      server
      .del("/messages/" + test_message_id)
      .expect(200)
      .end(function(err, res) {
        res.status.should.equal(200);
        done();
      });
    });
  });

  after(function(done) {
    db.close();
    done();
  });
});