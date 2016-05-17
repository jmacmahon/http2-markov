var Router = require('router');
var serveStatic = require('serve-static');
var path = require('path');

module.exports = function (appState) {
  var history = require('../history')(appState);

  var staticRouter = new Router();

  staticRouter.use('/', history);
  staticRouter.use('/', serveStatic(path.join(__dirname, '../../static')));

  return {
    router: staticRouter
  };
};
