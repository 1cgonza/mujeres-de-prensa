import { limits } from '../utils/data';
import Temas from './Temas';
import Lugares from './Lugares';

export default class Parser {
  constructor(rawData, meta, tableName) {
    this.rawData = rawData;
    this.tableName = tableName;
    this.manager;
    this.meta = meta;
  }

  displaySheets(sheets) {
    let ul = document.getElementById('sheets');

    sheets.forEach(name => {
      let li = document.createElement('li');
      li.innerText = name;
      li.onclick = event => {
        let key = event.target.innerText;
        let data = {
          raw: this.rawData.Sheets[key]
        };

        if (this.rawData.Sheets.hasOwnProperty(`temas${key}`)) {
          data.themes = this.rawData.Sheets[`temas${key}`];
        }

        if (limits.hasOwnProperty(this.tableName)) {
          data.limit = limits[this.tableName][key];
        }

        this.manager.init(data, this.meta[key], key);
      };
      ul.appendChild(li);
    });
  }

  init() {
    let sheetNames = this.rawData.SheetNames;

    switch (this.tableName) {
      case 'temas':
        sheetNames = this.rawData.SheetNames.filter(el => el.indexOf('temas') < 0);
        this.manager = new Temas(this.tableName);
        this.displaySheets(sheetNames);
        break;
      case 'lugares':
        this.manager = new Lugares(this.tableName, this.rawData, this.meta);
        break;
    }
  }
}
