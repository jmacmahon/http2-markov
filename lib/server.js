var fs = require('fs');
var http2 = require('http2');
var path = require('path');
var Router = require('router');
var finalhandler = require('finalhandler');

var options = {
  key: fs.readFileSync(path.join(__dirname, '../ssl/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '../ssl/localhost.crt')),
};

var router = new Router();
router.get('/', function (request, response) {
  response.end('Hello world!');
});

http2.createServer(options, function (request, response) {
  router(request, response, finalhandler(request, response));
}).listen(8080);
