// @flow

import Brain from './brain/Brain';
import Simulator from './modules/simulator/Simulator';
import Hue from './modules/hue/Hue';
import Mailjet from './modules/mailjet/Mailjet';
import Nest from './modules/nest/Nest';
import YahooWeather from './modules/weather/YahooWeather';
import ZWave from './modules/zwave/ZWave';

import IO from 'socket.io';
import winston from 'winston';
import express from 'express';
import bodyParser from 'body-parser';
import localtunnel from 'localtunnel';
import { createServer } from 'http';
import url from 'url';

import componentsApi from './api/components';
import modulesApi from './api/modules';
import googleApi from './api/google';
import authApi from './api/auth';
import backgroundApi from './api/background';
import settingsApi from './api/settings';
import sceneApi from './api/scene';
import voiceApi from './api/voice';
import middlewares from './api/middlewares';

const port = 3000;

let logger = new winston.Logger({
  level: 'debug',
  transports: [
    new (winston.transports.Console)({ colorize: true, timestamp: true }),
  ]
});

let brain = new Brain(logger);
brain.registerModule(new Simulator());
brain.registerModule(new Hue());
brain.registerModule(new Mailjet());
brain.registerModule(new Nest());
brain.registerModule(new YahooWeather());
brain.registerModule(new ZWave());
brain.startAll();

let app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/../../public'));
app.use(middlewares(brain).authMiddleware);

app.get('/api/v1/components', componentsApi(brain).getAll);
app.put('/api/v1/components/:id', componentsApi(brain).update);
app.post('/api/v1/google/actions', googleApi(brain, logger).handle);
app.get('/api/v1/modules', modulesApi(brain).getAll);
app.put('/api/v1/modules/:id', modulesApi(brain).update);
app.get('/api/v1/modules/:id/auth', authApi(brain).getAuthorizationCode);
app.get('/api/v1/scenes', sceneApi(brain).getAll);
app.post('/api/v1/scenes', sceneApi(brain).create);
app.put('/api/v1/scenes/:id', sceneApi(brain).update);
app.post('/api/v1/scenes/:id/launch', sceneApi(brain).run);
app.delete('/api/v1/scenes/:id', sceneApi(brain).delete);
app.get('/api/v1/settings', settingsApi(`http://${brain.getServerId()}.laibulle.com`).getAll);
app.get('/images/background.jpg', backgroundApi(brain).getBackground);
app.post('/api/v1/voice', voiceApi(brain).create);

let config = { host: 'http://laibulle.com:1234', subdomain: undefined }

if (brain.getServerId() != null) {
  config.subdomain = brain.getServerId();
}

let tunnel = localtunnel(
  port,
  config,
  (err, tunnel) => {
    if (err) { logger.error(err); return }

    if (brain.getServerId() == null) {
       const foundUrl = url.parse(tunnel.url);
       if (foundUrl.host != null) {
         const sub = foundUrl.host.split('.', 1)[0];
         brain.configurationManager.serverId = sub;
         brain.configurationManager.save();
       }
    }

    logger.info(tunnel.url);
  });

tunnel.on('close', () => {
  logger.info('tunnel closed');
  process.exit();
});

process.on('SIGINT', () => {
  logger.info('shutdown application');
  tunnel.close();
});

let server = createServer(app);
let io = IO(server);

io.on('connection', (socket) => {
  socket.on('get_modules', function (data) {
    socket.emit('modules', {
      data: brain.getModules()
    });
  });

  brain.onEvent(() => {

  })
});

server.listen(port, undefined, undefined, undefined, () => {
  logger.info(`Example app listening on port ${port}!`);
});
