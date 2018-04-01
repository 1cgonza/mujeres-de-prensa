import Default from './Default';

export default class Generos extends Default {
  init(data, sheetName) {
    this.data = data;
    this.sheetName = sheetName;
    console.log(this.data, this.tableName, this.sheetName);
  }
}