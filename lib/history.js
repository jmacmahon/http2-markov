var Router = require('router');
var onFinished = require('on-finished');

var historyRouter = new Router();

historyRouter.use('/', function (req, res, next) {
  onFinished(res, function () {
    if (res.statusCode < 400 && res.statusCode >= 200) {
      if (req.session.history === undefined) {
        req.session.history = [];
      }

      req.session.history.push(req.url);
      // must explicitly save as we are executing after res finished
      req.session.save();
    }
  });
  next();
});

module.exports = historyRouter;
