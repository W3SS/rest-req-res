module.exports = function(config){

  var allowHeaders = config.cors.allowHeaders.join(', ');
  var allowMethods = config.cors.allowMethods.join(', ');
  var maxAge = config.cors.maxAge;

  return function (req, res, next) {
    var origin = req.header('Origin') || null;
    if (config.api.origin.indexOf(origin) === -1){
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
