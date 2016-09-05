var allowedMethods = ['GET','POST','PUT','DELETE'];

module.exports = function(req, res, next){
  var method, xMethod;
  req.originalMethod = req.method;
  if (req.headers['x-http-method']){
    xMethod = req.headers['x-http-method'];
  }
  if (req.headers['x-http-method-override']){
    xMethod = req.headers['x-http-method-override'];
  }
  if (req.headers['x-method-override']){
    xMethod = req.headers['x-method-override'];
  }
  if (xMethod){
    method = xMethod.toUpperCase();
  }
  if (typeof req.query === 'object' && req.query.httpMethod){
    method = req.query.httpMethod.toUpperCase();
  }
  if (typeof req.body === 'object' && req.body.httpMethod){
    method = req.body.httpMethod.toUpperCase();
  }
  if (method){
    req.method = allowedMethods.indexOf(method) !== -1 ? method : 'UNDEFINED';
  }
  next();
};
