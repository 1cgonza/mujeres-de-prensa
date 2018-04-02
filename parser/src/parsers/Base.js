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
    this.errors = false;
    this.errorData = [];
    document.getElementById('errors').innerText = '';
    this.data = data;
    this.sheetName = sheetName;
    this.totalRows = this.getFinalRow();
    this.meta = this.cleanMeta(meta);
    this.clean();
    this.printErrors();
    console.log('FINISHED');
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

  getTitleAndPages(data) {
    // Check if title has '(p.' or '(P.'
    let regex = /(\(p.|\(P.)/;
    let str = data.value.trim();
    let match = regex.exec(str);
    let ret = {};

    if (!match) {
      ret.title = str;

      if (str.indexOf('(') > 0) {
        this.setError({
          expand: true,
          error: {
            error: `If the following title has page number(s), it is missing the page indicator. i.e (p.1`,
            title: str,
            cell: data.key
          }
        });
      }
    } else {
      if (str.indexOf(')') < 0) {
        this.setError({
          expand: true,
          error: {
            error: `The title appears to have page numbers but no closing parenthesis`,
            title: match.input,
            cell: data.key
          }
        });
      } else {
        ret.title = str.slice(0, match.index).trim();
        ret.pages = this.validatePages(str.slice(match.index + 3, str.length - 1));
        console.log(str.slice(match.index + 3, str.length - 1));
      }
      //console.log(this.validatePages(str.slice(i1 + 1, i2)));
    }

    let arr = data.value.trim().split('(p.');
    arr[0] = arr[0].trim();
    console.log(ret);
    //console.log(arr, data.key, regex, regex.exec(data.value));
    // if (arr.length === 1) {
    //   return arr[0]
    // }
    // let pgs = arr[1].trim();
    // if (pgs.indexOf'(p.' < 0)) {
    //   this.setError({
    //     error: {
    //       error: `Review page `
    //     }
    //   })
    // }

    return ret;
  }

  validatePages(str) {
    let arr = [];

    if (str.indexOf('-')) {
      let range = str.split('-');

      if (range.length === 2 && range.every(el => !isNaN(el))) {
        let start = +range[0];
        let end = +range[1];
        let rangeLength = end - start;

        for (let n = start; n <= end; n++) {
          arr.push(n);
        }
      }
    } else {
      arr.push(this.validateNumber(str));
    }

    return arr;
  }

  validateNumber(str) {
    if (!isNaN(str)) {
      return +str;
    } else {
      return str;
    }
  }

  cleanNumbers(str) {

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

      this.errorData.forEach((err, i) => {
        let view = new JSONView(`Error ${i}`, err.data);
        view.expand(err.expand);
        wrapper.appendChild(view.dom);
      });
    }
  }
}
