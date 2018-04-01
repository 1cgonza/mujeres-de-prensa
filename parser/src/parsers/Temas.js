import Default from './Default';

export default class Temas extends Default {
  init(data, sheetName) {
    this.data = data;
    this.sheetName = sheetName;
    console.log(this.data, this.tableName, this.sheetName);

    for (let key in this.data.raw) {
      if (key.charAt(0) !== '!') {
        console.log(this.getColRow(key));
      }
    }
  }
}
