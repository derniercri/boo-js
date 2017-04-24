'use strict';

var _Brain = require('./brain/Brain');

var _Brain2 = _interopRequireDefault(_Brain);

var _Simulator = require('./modules/simulator/Simulator');

var _Simulator2 = _interopRequireDefault(_Simulator);

var _Hue = require('./modules/hue/Hue');

var _Hue2 = _interopRequireDefault(_Hue);

var _Mailjet = require('./modules/mailjet/Mailjet');

var _Mailjet2 = _interopRequireDefault(_Mailjet);

var _Nest = require('./modules/nest/Nest');

var _Nest2 = _interopRequireDefault(_Nest);

var _YahooWeather = require('./modules/weather/YahooWeather');

var _YahooWeather2 = _interopRequireDefault(_YahooWeather);

var _ZWave = require('./modules/zwave/ZWave');

var _ZWave2 = _interopRequireDefault(_ZWave);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _localtunnel = require('localtunnel');

var _localtunnel2 = _interopRequireDefault(_localtunnel);

var _http = require('http');

var _components = require('./api/components');

var _components2 = _interopRequireDefault(_components);

var _modules = require('./api/modules');

var _modules2 = _interopRequireDefault(_modules);

var _google = require('./api/google');

var _google2 = _interopRequireDefault(_google);

var _auth = require('./api/auth');

var _auth2 = _interopRequireDefault(_auth);

var _background = require('./api/background');

var _background2 = _interopRequireDefault(_background);

var _settings = require('./api/settings');

var _settings2 = _interopRequireDefault(_settings);

var _scene = require('./api/scene');

var _scene2 = _interopRequireDefault(_scene);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = 3000;

var logger = new _winston2.default.Logger({
  level: 'debug',
  transports: [new _winston2.default.transports.Console({ colorize: true, timestamp: true })]
});

var brain = new _Brain2.default(logger);
brain.registerModule(new _Simulator2.default());
brain.registerModule(new _Hue2.default());
brain.registerModule(new _Mailjet2.default());
brain.registerModule(new _Nest2.default());
brain.registerModule(new _YahooWeather2.default());
brain.registerModule(new _ZWave2.default());
brain.startAll();

var app = (0, _express2.default)();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());
app.use('/', _express2.default.static(__dirname + '/../../public'));

app.get('/api/v1/components', (0, _components2.default)(brain).getAll);
app.put('/api/v1/components/:id', (0, _components2.default)(brain).update);
app.post('/api/v1/google/actions', (0, _google2.default)(brain, logger).handle);
app.get('/api/v1/modules', (0, _modules2.default)(brain).getAll);
app.put('/api/v1/modules/:id', (0, _modules2.default)(brain).update);
app.get('/api/v1/modules/:id/auth', (0, _auth2.default)(brain).getAuthorizationCode);
app.get('/api/v1/scenes', (0, _scene2.default)(brain).getAll);
app.post('/api/v1/scenes', (0, _scene2.default)(brain).create);
app.put('/api/v1/scenes/:id', (0, _scene2.default)(brain).update);
app.post('/api/v1/scenes/:id/launch', (0, _scene2.default)(brain).run);
app.delete('/api/v1/scenes/:id', (0, _scene2.default)(brain).delete);
app.get('/api/v1/settings', (0, _settings2.default)('http://' + brain.getServerId() + '.laibulle.com').getAll);
app.get('/images/background.jpg', (0, _background2.default)(brain).getBackground);

var tunnel = (0, _localtunnel2.default)(port, { subdomain: brain.getServerId(), host: 'http://laibulle.com:1234' }, function (err, tunnel) {
  if (err) {
    logger.error(err);return;
  }
  logger.info(tunnel.url);
});

tunnel.on('close', function () {
  logger.info('tunnel closed');
  process.exit();
});

process.on('SIGINT', function () {
  logger.info('shutdown application');
  tunnel.close();
});

var server = (0, _http.createServer)(app);
var io = (0, _socket2.default)(server);

io.on('connection', function (socket) {
  socket.on('get_modules', function (data) {
    socket.emit('modules', {
      data: brain.getModules()
    });
  });

  brain.onEvent(function () {});
});

server.listen(port, undefined, undefined, undefined, function () {
  logger.info('Example app listening on port ' + port + '!');
});