var Router = require('router');

module.exports = function (appState) {
  var debugRouter = new Router();

  debugRouter.get('/all_sessions', function (req, res) {
    req.sessionStore.all(function (err, sessions) {
      res.end(JSON.stringify(sessions, null, '  '));
    });
  });

  debugRouter.get('/get_session', function (req, res) {
    res.end(JSON.stringify(req.session, null, '  '));
  });

  debugRouter.get('/set_session', function (req, res) {
    req.session.test = 'bla';
    res.end('ok');
  });

  debugRouter.get('/', function (req, res) {
    var push = res.push('/test/push.js');
    push.writeHead(200);
    push.end('document.write("Pushed!")');

    res.end('<script type="text/javascript" src="/test/push.js"></script>');
  });

  debugRouter.get('/push.js', function (req, res) {
    res.writeHead(200);
    res.end('document.write("Hello World!");');
  });

  return {
    router: debugRouter
  };
};
