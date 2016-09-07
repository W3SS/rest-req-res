var express = require('express');
var methodOverride = require('./middleware/method-override.js');
var cors = require('./middleware/cors.js');
var response = require('./middleware/response.js');
var jsonParser = require('./middleware/json-parser.js');
var xmlParser = require('./middleware/xml-parser.js');
var bodyParser = require('body-parser');

module.exports = function(app){
  var config = app.get('config') || {};
  app.set('trust proxy', true);
  app.use(methodOverride);
  app.use(cors(config));
  app.use(response(config));
  app.use(jsonParser);
  app.use(xmlParser);
  app.use(bodyParser.urlencoded({extended: true}));
};