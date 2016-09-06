var express = require('express');
var methodOverride = require('./middleware/method-override.js');
var cors = require('./middleware/cors.js');
var response = require('./middleware/response.js');
var jsonParser = require('./middleware/json-parser.js');
var xmlParser = require('./middleware/xml-parser.js');
var bodyParser = require('body-parser');
var config = require('./config/'+(process.env.NODE_ENV || 'local')+'.json');
var app = express();
app.set('trust proxy', true);
app.use(methodOverride);
app.use(cors(config));
app.use(response(config));
app.use(jsonParser);
app.use(xmlParser);
app.use(bodyParser.urlencoded({extended: true}));

/* EXAMPLE */
var router = express.Router();

router.get('/success', function(req, res) {
  res.success({
    test: true
  }, 200, {
    test: true
  });
});

router.get('/error', function(req, res) {
  res.error('CONFLICT', {
    test: true
  });
});

router.use(function(req, res) {
  res.error('NOT_FOUND');
});

app.use('/'+config.app.version, router);
app.listen(config.app.port, config.app.host);
