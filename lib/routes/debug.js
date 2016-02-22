var Router = require('router');

module.exports = function (appState) {
  var debugRouter = new Router();

  debugRouter.get('/check_logs', function (req, res) {
    res.end(JSON.stringify(appState.logs, null, '  '));
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
