module.exports = function(req, res, next){
  if (req.is('json')){
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function(){
      if (!data){
        return next();
      }
      try {
        req.body = JSON.parse(data);
      } catch(e){
        return res.error('BAD_REQUEST');
      }
      next();
    });
  } else {
    next();
  }
};
