var Router = require('router');
var onFinished = require('on-finished');

module.exports = function (appState) {
  var historyRouter = new Router();

  historyRouter.use('/', function (req, res, next) {
    onFinished(res, function () {
      if (res.statusCode < 400 && res.statusCode >= 200) {
        // this doesn't work, session keeps getting glomped ???
        if (req.session.hist === undefined) {
          req.session.hist = [];
        }

        req.session.hist.push(req.url);
        console.log(JSON.stringify(req.session.hist));
      }
    });
    next();
  });

  return historyRouter;
};
