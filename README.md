# REST Request Response
REST API helper, json and xml format, cors, methods override

[![npm package](https://nodei.co/npm/rest-req-res.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/rest-req-res)

## Installing

Installing of NPM package
``` bash
npm install rest-req-res
```

## How to use

Beginning
``` javascript
var request = require('request');
var express = require('express');
var app = express();
var config = require('./config.json');
var rest = require('rest-req-res');
config.errors = require('./errors.json');
app.set('config', config);
rest(app);
```

Success response
``` javascript
app.get('/success', function(req, res){
  res.success({
    resultField1: 'value1',
    resultField2: 'value2'
  }, 200, {
    metaField1: 'value1',
    metaField2: 'value2'
  });
});
```

Error response
``` javascript
app.get('/error', function(req, res) {
  res.error('CONFLICT', {
    details1: 'value1',
    details2: 'value2'
  });
});
```

app.use('/'+config.api.version, router);
app.listen(config.app.port, config.app.host);
```
