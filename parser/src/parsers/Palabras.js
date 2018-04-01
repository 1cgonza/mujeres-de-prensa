import Default from './Default';

export default class Palabras extends Default {
  init(data, sheetName) {
    this.data = data;
    this.sheetName = sheetName;
    console.log(this.data, this.tableName, this.sheetName);
  }
}
