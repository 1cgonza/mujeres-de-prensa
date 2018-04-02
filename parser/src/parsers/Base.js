import JSONView from 'json-view';

export default class Base {
  constructor(tableName) {
    this.tableName = tableName;
    this.errors = false;
    this.errorData = [];
    this.data = [];
  }

  clean() {
    // Each parser sets this
  }

  init(data, meta, sheetName) {
    this.data = data;
    this.sheetName = sheetName;
    this.totalRows = this.getFinalRow();
    this.meta = this.cleanMeta(meta);
    this.clean();
  }

  cleanMeta(data) {
    let meta = [];

    this.sortCells(this.getBaseArray(data)).forEach(obj => {
      if (obj.row !== 1) {
        let pos = obj.row - 2;
        let val = data[obj.key].v;

        if (obj.col === 'A') {
          meta[pos] = {
            ed: !isNaN(val) ? +val : val
          };
        } else if (obj.col === 'B') {
          meta[pos].month = val;
        } else if (obj.col === 'C') {
          meta[pos].year = !isNaN(val) ? +val : val;
        }
      }
    });

    return meta;
  }

  getBaseArray(data) {
    let arr = [];
    for (let key in data) {
      if (key.charAt(0) !== '!') {
        arr.push(this.getColRow(key));
      }
    }

    return arr;
  }

  sortCells(arr) {
    return arr.sort((a, b) => {
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
    });
  }

  getFinalRow() {
    if (this.data && this.data.hasOwnProperty('raw') && this.data.raw.hasOwnProperty('!ref')) {
      let row = this.getColRow(this.data.raw['!ref'].split(':')[1]).row;
      if (!isNaN(row)) {
        return row;
      } else {
        this.setError({
          stop: true,
          error: {
            error: `Final row is not a number, attempted from: ${this.data.raw['!ref'].split(':')[1]}`
          }
        });
      }
    } else {
      this.setError({
        stop: true,
        error: {
          error: `Data is not defined and can't get final row value`
        }
      });
    }
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

  setError(obj) {
    let expand = obj.hasOwnProperty('expand') ? obj.expand : false;
    this.errors = true;
    this.errorData.push({
      data: obj.error,
      expand: expand
    });

    if (obj.stop) {
      this.printErrors();
      throw new Error(`Can't continue execution until errors are resolved`);
    }
  }

  printErrors() {
    if (this.errors) {
      let wrapper = document.getElementById('errors');
      wrapper.innerText = '';

      this.errorData.forEach((err, i) => {
        let view = new JSONView(`Error ${i}`, err.data);
        view.expand(err.expand);
        wrapper.appendChild(view.dom);
      });
    }
  }
}
