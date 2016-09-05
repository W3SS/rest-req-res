module.exports = function(config){

  var allowHeaders = config.cors.allowHeaders.join(', ');
  var allowMethods = config.cors.allowMethods.join(', ');
  var maxAge = config.cors.maxAge;

  return function (req, res, next) {
    if (!req.xhr) {
      return next();
    }
    if (config.app.origin.indexOf(req.header('Origin')) === -1){
      res.statusCode = 200;
      return res.end();
    }
    res.header('Access-Control-Allow-Origin', req.headers && req.headers.origin ? req.headers.origin : '*');
    res.header('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS' || req.originalMethod === 'OPTIONS'){
      res.header('Access-Control-Allow-Headers', allowHeaders);
      res.header('Access-Control-Max-Age', maxAge);
      res.header('Access-Control-Allow-Methods', allowMethods);
      res.statusCode = 200;
      return res.end();
    }
    next();
  };

};
