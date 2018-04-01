export default class Default {
  constructor(tableName) {
    this.tableName = tableName;
  }

  getColRow(key, i) {
    i = i || 0;

    if (i < key.length) {
      if (isNaN(key.charAt(i))) {
        return this.getColRow(key, ++i);
      } else {
        return {
          col: key.slice(0, i),
          row: +key.slice(i, key.length),
          key: key
        };
      }
    }

    return key;
  }
}
