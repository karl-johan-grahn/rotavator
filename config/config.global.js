"use strict";
// Global settings
var config = module.exports = {};

config.db = {};
config.db.uri = process.env.MONGODB_URI;
config.db.MESSAGES_COLLECTION = "messages";

config.web = {};
config.web.port = process.env.PORT || 8080;