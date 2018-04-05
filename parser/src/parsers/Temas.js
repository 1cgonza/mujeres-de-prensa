import Base from './Base';
import { isArray } from 'util';
import { secondaryUrls } from '../utils/data';
import req from '../utils/req';

export default class Temas extends Base {
  constructor(tableName) {
    super(tableName);
    this.vols = [];
    this.categories = {};
  }

  clean() {
    this.getThemes();
    let cleanedData = this.sortAndFilter(this.getBaseArray(this.data.raw));
    this.getVols(this.vols, this.totalRows);

    cleanedData = cleanedData.map(ref => {
      let cell = this.data.raw[ref.key];
      let titlePages = this.getTitleAndPages(cell.v, ref.key);
      let ret = {
        title: titlePages.title,
        category: this.categories[ref.col]
      };

      if (titlePages.hasOwnProperty('pages')) {
        ret.pages = titlePages.pages;
      }

      if (cell.s.hasOwnProperty('fgColor')) {
        let theme = this.themes.find(el => el.color === cell.s.fgColor.rgb);

        if (theme) {
          ret.theme = theme.name;
        } else {
          this.setError({
            error: `Background color of cell ${ref.key} does not match any theme`,
            colorDataFound: cell.s
          });
        }
      }

      let meta = this.vols.find(obj => ref.row >= obj.rows[0] && ref.row <= obj.rows[1]);

      if (!meta) {
        this.setError({
          stop: true,
          error: {
            error: `Can't match edition number of cell ${ref.key} to anything`
          }
        });
      }

      Object.assign(ret, meta);
      // Object.assign(ret, ref);

      return ret;
    });

    req(secondaryUrls.generos).then(d => {
      if (d.hasOwnProperty('Sheets') && d.Sheets.hasOwnProperty(this.sheetName)) {
        let generosData = d.Sheets[this.sheetName];
        let finalRow = this.getFinalRow(generosData);
        let baseArr = this.getBaseArray(generosData);
        let vols = [];
        let generos = [];

        let cleaned = this.sortCells(baseArr).filter(obj => {
          if (obj.col === 'A') {
            if (obj.row !== 1) {
              let v = generosData[obj.key].v;
              let ed = !isNaN(v) ? +v : this.validatePages(v);
              vols.push(Object.assign(obj, {
                ed: ed
              }));
            }
            return false;
          } else if (obj.row === 1) {
            generos[obj.col] = generosData[obj.key].v;
            return false;
          }
          return true;
        });

        this.getVols(vols, finalRow);

        cleaned = cleaned.map(ref => {
          let cell = generosData[ref.key];
          console.log(cell, ref);
          let titlePages = this.getTitleAndPages(cell.v, ref.key);
          let ret = {
            title: titlePages.title,
          };
          

        });

        console.log(cleaned, vols, generos);
        // console.log(cleanedData, this.vols, this.categories);

      }
    });

  }

  sortAndFilter(colsRowsArr) {
    // empty these before starting
    this.vols = [];
    this.categories = {};

    return this.sortCells(colsRowsArr).filter(obj => {
      if (this.data.limit && obj.col > this.data.limit) {
        return false;
      } else if (obj.col === 'A') {
        if (obj.row !== 1) {
          let v = this.data.raw[obj.key].v;
          let ed = !isNaN(v) ? +v : this.validatePages(v);
          this.vols.push(Object.assign(obj, {
            ed: ed
          }));
        }
        return false;
      } else if (obj.row === 1) {
        this.categories[obj.col] = this.data.raw[obj.key].v;
        return false;
      }
      return true;
    });
  }

  getThemes() {
    let d = this.data.themes;
    this.themes = [];

    for (let key in d) {
      if (key.charAt(0) !== '!') {
        this.themes.push({
          name: d[key].v,
          color: d[key].s.fgColor.rgb
        });
      }
    }
  }

  getVols(base, totalRows) {
    base.forEach((obj, i) => {
      let meta = this.meta.find(d => {
        let edMeta = isArray(d.ed) ? d.ed[0] : d.ed;
        let edVols = isArray(obj.ed) ? obj.ed[0] : obj.ed;

        return edMeta === edVols;
      });
      let newObj = {
        rows: [obj.row]
      };

      if (obj.row < totalRows && i < base.length - 1) {
        if (obj.row === base[i + 1].row - 1) {
          newObj.rows[1] = obj.row;
        } else {
          newObj.rows[1] = base[i + 1].row - 1;
        }
      } else {
        newObj.rows[1] = totalRows;
      }

      if (meta) {
        Object.assign(newObj, meta);
      } else {
        this.setError({
          error: `Can't find meta information for edition: ${obj.value}`,
          globalMeta: this.meta,
          stop: true
        });
      }
      base[i] = newObj;
    });

    return base;
  }
}
