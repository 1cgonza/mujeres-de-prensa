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
    this.totalRows = data.hasOwnProperty('raw') ? this.getFinalRow(data.raw) : this.getFinalRow(data);
    this.meta = this.cleanMeta(meta);
    this.clean().then(cleanedData => {
      console.log(this.tableName, this.sheetName, cleanedData);
      this.createFile(cleanedData, `${this.sheetName}-${this.tableName}`);
      this.printErrors();
    });
  }

  cleanMeta(data) {
    let meta = [];

    this.sortCells(this.getBaseArray(data)).forEach(obj => {
      if (obj.row !== 1) {
        let pos = obj.row - 2;
        let val = data[obj.key].v;

        if (obj.col === 'A') {
          if (!isNaN(val)) {
            meta[pos] = {
              ed: +val
            };
          } else {
            let arr = this.validatePages(val);

            if (arr.length) {
              meta[pos] = {
                ed: arr
              };
            } else {
              this.setError({
                error: {
                  error: `Problem setting edition number(s) in ${obj.key}`,
                  value: val
                }
              });
            }
          }
        } else if (obj.col === 'B') {
          if (val.charAt(' y ')) {
            let arr = val.split(' y ');
            arr.forEach((m, i) => {
              arr[i] = m.trim();
            });
            meta[pos].month = arr;
          } else {
            meta[pos].month = val;
          }
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

  getFinalRow(data) {
    if (data.hasOwnProperty('!ref')) {
      let row = this.getColRow(data['!ref'].split(':')[1]).row;
      if (!isNaN(row)) {
        return row;
      } else {
        this.setError({
          stop: true,
          error: {
            error: `Final row is not a number, attempted from: ${data['!ref'].split(':')[1]}`
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

  getTitleAndPages(rawTitle, key) {
    // Check if title has '(p.' or '(P.'
    let regex = /(\(p.|\(P.)/;
    let str = rawTitle.trim();
    let match = regex.exec(str);
    let ret = {};

    if (!match) {
      ret.title = str;

      if (str.indexOf('(') > 0) {
        this.setError({
          expand: true,
          error: {
            warning: `If the following title has page number(s), it is missing the page indicator. i.e (p.1`,
            title: str,
            cell: key
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
            cell: key
          }
        });
      } else {
        ret.title = str.slice(0, match.index).trim();
        ret.pages = this.validatePages(str.slice(match.index + 3, str.length - 1));
      }
    }

    return ret;
  }

  validatePages(str) {
    let arr = [];

    if (str.indexOf(';') > 0) {
      let parts = str.split(';');
      parts.forEach(part => {
        arr.push(...this.validatePages(part));
      });
    }

    if (str.indexOf('-') > 0) {
      let range = str.split('-');

      if (range.length === 2 && range.every(el => !isNaN(el))) {
        let start = +range[0];
        let end = +range[1];
        let rangeLength = end - start;

        for (let n = start; n <= end; n++) {
          arr.push(n);
        }
      } else {

      }
    } else if (str.indexOf('y') > 0) {
      let nums = str.split('y');

      if (nums.length === 2 && nums.every(el => !isNaN(el))) {
        arr.push(...nums.map(num => +num));
      }
    } else if (str.indexOf(',') > 0) {
      let nums = str.split(',');

      nums.forEach(num => {
        if (!isNaN(num)) {
          arr.push(+num);
        } else {
          arr.push(...this.validatePages(num));
        }
      });
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

  createFile(data, name) {
    let container = document.getElementById('download');
    let blob = new Blob([JSON.stringify(data)], {type: 'text/json'});
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');

    container.innerText = '';
    name = name + '.json';

    a.innerText = name;
    a.href = url;
    a.download = name;
    container.appendChild(a);
  }
}
