var server;
var request = require('request');
var express = require('express');
var app = express();
var config = require('./_config.json');
var router = express.Router();
var rest = require('../index');
config.errors = require('./_errors.json');
app.set('config', config);
rest(app);

router.get('/success', function(req, res){
  res.success({
    test: true
  }, 200, {
    test: true
  });
});

router.get('/error', function(req, res) {
  res.error('CONFLICT', {
    test: true
  });
});

app.use('/'+config.api.version, router);

describe('Response specs', function(){

  var xmlSuccessResponse = '<?xml version="1.0" encoding="UTF-8"?>'+
        '<response><version>v1</version><status>200</status>'+
        '<meta><test>true</test></meta><result><test>true</test>'+
        '</result></response>';

  var jsonSuccessResponse = {
    version: 'v1',
    status: 200,
    meta: {
      test: true
    },
    result: {
      test: true
    }
  };

  var jsonErrorResponse = {
    version: 'v1',
    status: 409,
    error: {
      code: 409,
      message: 'Conflict',
      details: {
        test: true
      }
    }
  };

  beforeEach(function(done){
    server = app.listen(config.app.port, config.app.host, done);
  });

  it('should respond result in xml', function(done){
    request.get('http://127.0.0.1:31288/v1/success', function(error, response, body) {
      expect(response.statusCode).toBe(200);
      expect(body.replace(/<timestamp>.*<\/timestamp>/, '')).toBe(xmlSuccessResponse);
      done();
    });
  });

  it('should respond result in json', function(done){
    request.get({
      url: 'http://127.0.0.1:31288/v1/success',
      headers: {
        'Accept': 'application/json'
      }
    }, function(error, response, body) {
      var data = JSON.parse(body);
      delete data.timestamp;
      expect(response.statusCode).toBe(200);
      expect(data).toEqual(jsonSuccessResponse);
      done();
    });
  });

  it('should respond result in xml by query.responseFormat', function(done){
    request.get({
      url: 'http://127.0.0.1:31288/v1/success?responseFormat=xml',
      headers: {
        'Accept': 'application/json'
      }
    }, function(error, response, body) {
      expect(response.statusCode).toBe(200);
      expect(body.replace(/<timestamp>.*<\/timestamp>/, '')).toBe(xmlSuccessResponse);
      done();
    });
  });

  it('should respond result in json by query.responseFormat', function(done){
    request.get({
      url: 'http://127.0.0.1:31288/v1/success?responseFormat=json',
      headers: {
        'Accept': 'application/xml'
      }
    }, function(error, response, body) {
      var data = JSON.parse(body);
      delete data.timestamp;
      expect(response.statusCode).toBe(200);
      expect(data).toEqual(jsonSuccessResponse);
      done();
    });
  });

  it('should respond error Conflict', function(done){
    request.get({
      url: 'http://127.0.0.1:31288/v1/error',
      headers: {
        'Accept': 'application/json'
      }
    }, function(error, response, body) {
      var data = JSON.parse(body);
      delete data.timestamp;
      expect(response.statusCode).toBe(409);
      expect(data).toEqual(jsonErrorResponse);
      done();
    });
  });

  afterEach(function(done){
    server.close(done);
  });

});
