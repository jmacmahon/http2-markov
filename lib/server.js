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
  console.log('hit');

  // var push = response.push('/push.js');
  // push.writeHead(200);
  // push.end('document.write("Pushed!")');

  response.end('<script type="text/javascript" src="/push.js"></script>');
});

router.get('/push.js', function (request, response) {
  response.writeHead(200);
  response.end('document.write("Hello World!");');
});

http2.createServer(options, function (request, response) {
  router(request, response, finalhandler(request, response));
}).listen(8080);
