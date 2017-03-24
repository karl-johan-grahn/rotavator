"use strict";

var env = process.env.NODE_ENV || "development";
// Depending on the value of the node environment, different setting files will be loaded
console.log("Configuration:", env);
var cfg = require("./config." + env);

module.exports = cfg;