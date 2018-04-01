import { limits } from '../utils/data';
import Temas from './Temas';
import Palabras from './Palabras';
import Lugares from './Lugares';
import Generos from './Generos';

export default class Parser {
  constructor(rawData, tableName) {
    this.rawData = rawData;
    this.tableName = tableName;
    this.parser;
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

        this.parser.init(data, key);
      };
      ul.appendChild(li);
    });
  }

  init(key) {
    let sheetNames = this.rawData.SheetNames;

    switch (key) {
      case 'temas':
        sheetNames = this.rawData.SheetNames.filter(el => el.indexOf('temas') < 0);
        this.parser = new Temas(this.tableName);
        break;
      case 'palabras':
        this.parser = new Palabras(this.tableName);
        break;
      case 'lugares':
        this.parser = new Lugares(this.tableName);
        break;
      case 'generos':
        this.parser = new Generos(this.tableName);
        break;
    }

    this.displaySheets(sheetNames);
  }
}
