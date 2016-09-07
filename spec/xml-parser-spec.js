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

describe('XML parser specs', function(){

  var xmlSuccessResponse = '<?xml version="1.0" encoding="UTF-8"?>'+
        '<response><version>v1</version><status>200</status>'+
        '<meta><test>true</test></meta><result><test>true</test>'+
        '</result></response>';

  var xmlErrorResponse = '<?xml version="1.0" encoding="UTF-8"?>'+
        '<response><version>v1</version><status>400</status>'+
        '<error><code>400</code><message>Bad Request</message>'+
        '</error></response>';

  beforeEach(function(done){
    server = app.listen(config.app.port, config.app.host, done);
  });

  it('should parse xml', function(done){
    cb = function(body){
      expect(body).toEqual({test: '1'});
      cb = false;
    };
    request.post({
      url: 'http://127.0.0.1:31288/v1/success',
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml'
      },
      body: '<?xml version="1.0" encoding="UTF-8"?><test>1</test>'
    }, function(error, response, body) {
      expect(response.statusCode).toBe(200);
      expect(body.replace(/<timestamp>.*<\/timestamp>/, '')).toBe(xmlSuccessResponse);
      done();
    });
  });

  it('should respond Bad Request', function(done){
    request.post({
      url: 'http://127.0.0.1:31288/v1/success',
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml'
      },
      body: '<?xml version="1.0" encoding="UTF-8"?><test>1</test'
    }, function(error, response, body) {
      expect(response.statusCode).toBe(400);
      expect(body.replace(/<timestamp>.*<\/timestamp>/, '')).toBe(xmlErrorResponse);
      done();
    });
  });

  it('should not parse xml without Content-Type header', function(done){
    cb = function(body){
      expect(body).toEqual({});
      cb = false;
    };
    request.post({
      url: 'http://127.0.0.1:31288/v1/success',
      headers: {
        'Accept': 'application/xml'
      },
      body: '<?xml version="1.0" encoding="UTF-8"?><test>1</test>'
    }, function(error, response, body) {
      expect(response.statusCode).toBe(200);
      expect(body.replace(/<timestamp>.*<\/timestamp>/, '')).toBe(xmlSuccessResponse);
      done();
    });
  });

  afterEach(function(done){
    server.close(done);
  });

});
