var parseString = require('xml2js').parseString;

module.exports = function(req, res, next){
  if (req.is('xml')){
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function(){
      if (!data){
        return next();
      }
      parseString(data, {
        trim: true,
        explicitArray: false
      }, function(err, result){
        if (!err){
          req.body = result || {};
        } else {
          return res.error('BAD_REQUEST');
        }
        next();
      });
    });
  } else {
    next();
  }
};
