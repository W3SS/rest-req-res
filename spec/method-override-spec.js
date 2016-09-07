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

app.use('/'+config.api.version, router);

describe('Method override specs', function(){

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

  beforeEach(function(done){
    server = app.listen(config.app.port, config.app.host, done);
  });

  it('should override method by X-HTTP-Method', function(done){
    request.post({
      url: 'http://127.0.0.1:31288/v1/success',
      headers: {
        'Accept': 'application/json',
        'X-HTTP-Method': 'GET'
      }
    }, function(error, response, body) {
      var data = JSON.parse(body);
      delete data.timestamp;
      expect(response.statusCode).toBe(200);
      expect(data).toEqual(jsonSuccessResponse);
      done();
    });
  });

  it('should override method by X-HTTP-Method-Override', function(done){
    request.post({
      url: 'http://127.0.0.1:31288/v1/success',
      headers: {
        'Accept': 'application/json',
        'X-HTTP-Method-Override': 'GET'
      }
    }, function(error, response, body) {
      var data = JSON.parse(body);
      delete data.timestamp;
      expect(response.statusCode).toBe(200);
      expect(data).toEqual(jsonSuccessResponse);
      done();
    });
  });

  it('should override method by X-Method-Override', function(done){
    request.post({
      url: 'http://127.0.0.1:31288/v1/success',
      headers: {
        'Accept': 'application/json',
        'X-Method-Override': 'GET'
      }
    }, function(error, response, body) {
      var data = JSON.parse(body);
      delete data.timestamp;
      expect(response.statusCode).toBe(200);
      expect(data).toEqual(jsonSuccessResponse);
      done();
    });
  });

  it('should override method by query.httpMethod', function(done){
    request.post({
      url: 'http://127.0.0.1:31288/v1/success?httpMethod=get',
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

  afterEach(function(done){
    server.close(done);
  });

});
