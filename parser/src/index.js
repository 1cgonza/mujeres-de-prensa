import { urls, metaUrls } from './utils/data';
import req from './utils/req';
import Parser from './parsers/Main';

const tables = Object.keys(urls);
let ulTables = document.getElementById('tables');

tables.forEach(name => {
  let li = document.createElement('li');
  li.innerText = name;
  li.onclick = event => {
    let key = event.target.innerText;
    document.getElementById('sheets').innerText = '';

    req(metaUrls.ediciones).then(meta => {
      req(urls[key]).then(data => {
        let parser = new Parser(data, meta.Sheets, key);
        parser.init();
      });
    });
  };

  ulTables.appendChild(li);
});
