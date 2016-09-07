var server;
var request = require('request');
var express = require('express');
var app = express();
var config = require('./config.json');
var router = express.Router();
var rest = require('../index');
config.errors = require('./errors.json');
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

describe('Success response', function(){

  beforeEach(function(done){
    server = app.listen(config.app.port, config.app.host, done);
  });

  it('should respond status 200 and result', function(done){
    request.get({
      url: 'http://127.0.0.1:31288/v1/success',
      headers: {
        'Origin': 'Test'
      }
    }, function(error, response, body) {
      var _body = '<?xml version="1.0" encoding="UTF-8"?>'+
        '<response><version>v1</version><status>200</status>'+
        '<meta><test>true</test></meta><result><test>true</test>'+
        '</result></response>';
      expect(response.statusCode).toBe(200);
      expect(body.replace(/<timestamp>.*<\/timestamp>/, '')).toBe(_body);
      done();
    });
  });

  afterEach(function(done){
    server.close(done);
  });

});
