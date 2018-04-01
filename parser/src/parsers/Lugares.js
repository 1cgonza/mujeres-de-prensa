import Default from './Default';

export default class Lugares extends Default {
  init(data, sheetName) {
    this.data = data;
    this.sheetName = sheetName;
    console.log(this.data, this.tableName, this.sheetName);

    let arr = [];
    for (let key in this.data.raw) {
      if (key.charAt(0) !== '!') {
        arr.push(this.getColRow(key));
      }
    }

    console.log(arr.sort((a, b) => {
      let colA = a.col.toUpperCase();
      let colB = b.col.toUpperCase();
      let rowA = a.row;
      let rowB = b.row;

      if (colA == colB && colA.length === colB.length) {
        return rowA - rowB;
      } else if (colA.length !== colB.length) {
        return colA.length - colB.length;
      }

      return colA < colB ? -1 : colA > colB ? 1 : 0;
    }));
  }
}