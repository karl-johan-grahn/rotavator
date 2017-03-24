"use strict";

var express = require("express");
// Parse the body portion of an incoming request stream and expose the resulting object on req.body
var bodyParser = require("body-parser");
var mongodb = require("mongodb");

// Node.js will first attempt to load index.js out of the configuration directory
var config = require("./config");

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable in the global scope so the connection can be used by all the route handlers
var db;

// Connect to the database before starting the application server
mongodb.MongoClient.connect(config.db.uri, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app
  var server = app.listen(config.web.port, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

  process.on("SIGINT", function () {
    console.log("Gracefully shutting down from SIGINT (Ctrl+C)");
    db.close();
    process.exit();
  });
});

/** @function isPalindrome
 * Determine if a string is a palindrome. A palindrome is defined here as a word or sentence
 * that's spelled the same way both forward and backward, ignoring punctuation, case, and spacing.
 * Base cases:
 *  - an empty string is not considered a palindrome
 *  - a single character string is considered a palindrome
 * The function attempts to support Unicode.
 * Time complexity is O(n).
 * @param {string} str
 * @return {boolean} boolean indicating if str is a palindrome
 */
function isPalindrome(str) {
  if ((typeof str == "undefined") || (str.length == 0)) {
    return false;
  } else if (str.length == 1) {
    return true;
  }
  var removeChar = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]\\'"<> ]/g, "").toLowerCase();
  var len = Math.floor(removeChar.length / 2);
  for (var i = 0; i < len; i++) {
    if (removeChar[i] !== removeChar[removeChar.length - i - 1]) {
      return false;
    }
  }
  return true;
}

var ObjectID = mongodb.ObjectID;
var MESSAGES_COLLECTION = "messages";

// Generic error handler used by all endpoints
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

// Message API routes below

/**
 * @api {get} /messages List all received messages
 * @apiVersion 1.0.0
 * @apiName GetMessages
 * @apiGroup Messages
 *
 * @apiSuccess {Object[]} messages List of messages
 * @apiSuccess {String} messages._id Message ID
 * @apiSuccess {String} messages.text Message text
 * @apiSuccess {Boolean} messages.isPalindrome Boolean indicating if the message text is a palindrome
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *         "_id": "58d1b5a865e5b510c8d787e0",
 *         "text": "漢語 語漢",
 *         "isPalindrome": true
 *       }, {
 *         "_id": "58d2f36768f4d01c4487e48a",
 *         "text": "asdfasdf",
 *         "isPalindrome": false
 *       }
 *     ]
 */
app.get("/messages", function(req, res) {
  db.collection(MESSAGES_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get messages");
    } else {
      res.status(200).json(docs);
    }
  });
});

/**
 * @api {post} /messages Post a message
 * @apiVersion 1.0.0
 * @apiName NewMessage
 * @apiGroup Message
 *
 * @apiParam {String} text Text for new message
 *
 * @apiSuccess {String} text Message text
 * @apiSuccess {Boolean} isPalindrome Boolean indicating if the message text is a palindrome
 * @apiSuccess {String} _id Message ID
 *
 * @apiSuccessExample {json} Success-Response
 *     HTTP/1.1 201 Created
 *     {
 *       "text": "test message",
 *       "isPalindrome": false,
 *       "_id": "58d3024a2c414e0f5cb1facf"
 *     }
 */
app.post("/messages", function(req, res) {
  var newMessage = {
    text: req.body.text,
    isPalindrome: isPalindrome(req.body.text)
  };
  db.collection(MESSAGES_COLLECTION).insertOne(newMessage, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new message");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/**
 * @api {get} /messages/:id List a message
 * @apiVersion 1.0.0
 * @apiName GetMessage
 * @apiGroup Message
 *
 * @apiParam {String} ObjectId ID of the message
 *
 * @apiSuccess {String} _id Message ID
 * @apiSuccess {String} text Message text
 * @apiSuccess {Boolean} isPalindrome Boolean indicating if the message text is a palindrome
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "58d1b5a865e5b510c8d787e0",
 *       "text": "漢語 語漢",
 *       "isPalindrome": true
 *     }
 *
 * @apiError FailedToGetMessage The message with that ID could not be found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error":"Failed to get message"
 *     }
 */
app.get("/messages/:id", function(req, res) {
  db.collection(MESSAGES_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get message");
    } else if (!doc) {
      handleError(res, "FailedToGetMessage", "Failed to get message with that ID", 404);
    } else {
      res.status(200).json(doc);
    }
  });
});

/**
 * @api {delete} /messages/:id Delete a message
 * @apiVersion 1.0.0
 * @apiName DeleteMessage
 * @apiGroup Message
 *
 * @apiParam {String} ObjectId Message ID
 */
app.delete("/messages/:id", function(req, res) {
  db.collection(MESSAGES_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete message");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});

// Middleware for redirecting and responding when a wrong route is entered
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + " not found"})
});

//module.exports = app;