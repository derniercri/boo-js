import blessed from 'blessed';
import BooAPI from './../sdk/BooAPI';
import renderModule from './views/modules';
import contrib from 'blessed-contrib';

// Create a screen object.
let screen = blessed.screen({
  smartCSR: true
});

let booAPI: BooAPI = new BooAPI('http://localhost:3000');
let modules = booAPI.getModules();
booAPI.getComponents().then((components) => {
  screen.title = 'Boo CLI';

  // Quit on Escape, q, or Control-C.
  screen.key(['escape', 'q', 'C-c'], (ch, key) => {
    return process.exit(0);
  });

  var table = contrib.table(
    {
      keys: true
      //, fg: 'hite'
      //, selectedFg: 'white'
      //, selectedBg: 'blue'
      , interactive: true
      , label: 'Components'
      , width: '50%'
      , height: '50%'
      , border: { type: "line", fg: "cyan" }
      , columnSpacing: 10 //in chars
      , columnWidth: [20, 20, 20] /*in chars*/
    })

  //allow control the table with the keyboard
  table.focus()

  table.setData(
    {
      headers: ['label', 'type', 'value']
      , data: components.map((item) => {
        return [item.label, item.type, item.values.on]
      })
    })

  screen.append(table);

  // Render the screen.
  screen.render();
});
