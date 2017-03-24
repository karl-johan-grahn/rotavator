"use strict";
// Test specific settings overriding the global settings
var config = require("./config.global");

config.db.uri = process.env.MONGODB_TEST_URI;

module.exports = config;