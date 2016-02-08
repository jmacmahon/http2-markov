var fs = require('fs');
var http2 = require('http2');
var path = require('path');
var Router = require('router');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var morgan = require('morgan');

var options = {
  key: fs.readFileSync(path.join(__dirname, '../ssl/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '../ssl/localhost.crt')),
};

var router = new Router();

var logs = {};

router.use(morgan('combined'));

router.get('/test/check_logs', function (req, res) {
  res.end(JSON.stringify(logs, null, '  '));
});

router.get('/test', function (req, res) {
  var push = res.push('/test/push.js');
  push.writeHead(200);
  push.end('document.write("Pushed!")');

  res.end('<script type="text/javascript" src="/test/push.js"></script>');
});

router.get('/test/push.js', function (req, res) {
  res.writeHead(200);
  res.end('document.write("Hello World!");');
});

router.use('/static', function (req, res, next) {
  if (!logs.hasOwnProperty(req.connection.remoteAddress)) {
    logs[req.connection.remoteAddress] = [];
  }
  logs[req.connection.remoteAddress].push(req.url);
  next();
});
router.use('/static', serveStatic(path.join(__dirname, '../static')));

http2.createServer(options, function (request, response) {
  router(request, response, finalhandler(request, response));
}).listen(8080);
