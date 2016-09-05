var json2xml = require('json2xml');
var errors = require('../config/errors.json');

module.exports = function(config){

  var response = function(req, res, result){
    if (req.is('xml') || req.query.responseFormat === 'xml'){
      res.set('Content-Type', 'text/xml');
      res.send(json2xml({response: result}, {header: true}));
    } else {
      res.json(result);
    }
  };

  var successResponse = function(req, res, data, status, meta){
    var result = {};
    status = status || 200;
    result.version = config.app.version;
    result.status = status;
    if (meta){
      result.meta = meta;
    }
    if (data){
      result.result = data;
    }
    result.timestamp = Date.now();
    res.status(req.query.forcedResponseStatus || status);
    response(req, res, result);
  };

  var errorResponse = function(req, res, err, details){
    var status, result = {};
    err = err && errors[err] ? err : 'UNKNOWN_ERROR';
    status = errors[err].status;
    result.version = config.app.version;
    result.status = status;
    result.error = {
      code: errors[err].code,
      message: errors[err].message
    };
    if (details){
      result.error.details = details;
    }
    result.timestamp = Date.now();
    res.status(req.query.forcedResponseStatus || status);
    response(req, res, result);
  };

  return function(req, res, next){
    res.success = function(data, status, meta){
      successResponse(req, res, data, status, meta);
    };
    res.error = function(err, details){
      errorResponse(req, res, err, details);
    };
    next();
  };

};
