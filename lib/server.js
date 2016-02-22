var fs = require('fs');
var http2 = require('http2');
var path = require('path');
var Router = require('router');
var finalhandler = require('finalhandler');
var morgan = require('morgan');

var appState = {
  logs: {}
};

var routes = {
  debug: require('./routes/debug')(appState),
  static: require('./routes/static')(appState)
};

var options = {
  key: fs.readFileSync(path.join(__dirname, '../ssl/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '../ssl/localhost.crt')),
};

var topLevelRouter = new Router();

topLevelRouter.use(morgan('combined'));

topLevelRouter.use('/debug', routes.debug.router);
topLevelRouter.use('/static', routes.static.router);

http2.createServer(options, function (request, response) {
  topLevelRouter(request, response, finalhandler(request, response));
}).listen(8080);
