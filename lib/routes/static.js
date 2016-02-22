var Router = require('router');
var serveStatic = require('serve-static');
var path = require('path');
var onFinished = require('on-finished');

module.exports = function (appState) {
  var staticRouter = new Router();

  staticRouter.use('/', serveStatic(path.join(__dirname, '../../static')));
  staticRouter.use('/', function (req, res, next) {
    onFinished(res, function () {
      // TODO this is not called when a request succeeds: why?
      console.log(res);
      if (res.statusCode < 400 && res.statusCode >= 200) {
        if (!appState.logs.hasOwnProperty(req.connection.remoteAddress)) {
          appState.logs[req.connection.remoteAddress] = [];
        }
        appState.logs[req.connection.remoteAddress].push(req.url);
      }
    });
    next();
  });

  return {
    router: staticRouter
  };
};
