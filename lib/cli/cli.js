'use strict';

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _BooAPI = require('./../sdk/BooAPI');

var _BooAPI2 = _interopRequireDefault(_BooAPI);

var _modules = require('./views/modules');

var _modules2 = _interopRequireDefault(_modules);

var _blessedContrib = require('blessed-contrib');

var _blessedContrib2 = _interopRequireDefault(_blessedContrib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create a screen object.
var screen = _blessed2.default.screen({
  smartCSR: true
});

var booAPI = new _BooAPI2.default('http://localhost:3000');
var modules = booAPI.getModules();
booAPI.getComponents().then(function (components) {
  screen.title = 'Boo CLI';

  // Quit on Escape, q, or Control-C.
  screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
  });

  var table = _blessedContrib2.default.table({
    keys: true
    //, fg: 'hite'
    //, selectedFg: 'white'
    //, selectedBg: 'blue'
    , interactive: true,
    label: 'Components',
    width: '50%',
    height: '50%',
    border: { type: "line", fg: "cyan" },
    columnSpacing: 10 //in chars
    , columnWidth: [20, 20, 20] /*in chars*/
  });

  //allow control the table with the keyboard
  table.focus();

  table.setData({
    headers: ['label', 'type', 'value'],
    data: components.map(function (item) {
      return [item.label, item.type, item.values.on];
    })
  });

  screen.append(table);

  // Render the screen.
  screen.render();
});