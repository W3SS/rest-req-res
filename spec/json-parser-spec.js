var server, cb;
var request = require('request');
var express = require('express');
var app = express();
var config = require('./_config.json');
var router = express.Router();
var rest = require('../index');
config.errors = require('./_errors.json');
app.set('config', config);
rest(app);

router.post('/success', function(req, res){
  typeof cb === 'function' && cb(req.body);
  res.success({
    test: true
  }, 200, {
    test: true
  });
});

app.use('/'+config.api.version, router);

describe('JSON parser specs', function(){

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
    status: 400,
    error: {
      code: 400,
      message: 'Bad Request'
    }
  };

  beforeEach(function(done){
    server = app.listen(config.app.port, config.app.host, done);
  });

  it('should parse json', function(done){
    cb = function(body){
      expect(body).toEqual({test: 1});
      cb = false;
    };
    request.post({
      url: 'http://127.0.0.1:31288/v1/success',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: '{"test": 1}'
    }, function(error, response, body) {
      var data = JSON.parse(body);
      delete data.timestamp;
      expect(response.statusCode).toBe(200);
      expect(data).toEqual(jsonSuccessResponse);
      done();
    });
  });

  it('should respond Bad Request', function(done){
    request.post({
      url: 'http://127.0.0.1:31288/v1/success',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: '{"test":'
    }, function(error, response, body) {
      var data = JSON.parse(body);
      delete data.timestamp;
      expect(response.statusCode).toBe(400);
      expect(data).toEqual(jsonErrorResponse);
      done();
    });
  });

  it('should not parse json without Content-Type header', function(done){
    cb = function(body){
      expect(body).toEqual({});
      cb = false;
    };
    request.post({
      url: 'http://127.0.0.1:31288/v1/success',
      headers: {
        'Accept': 'application/json'
      },
      body: '{"test": 1}'
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
