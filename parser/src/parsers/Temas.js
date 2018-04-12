import Base from './Base';
import { isArray } from 'util';
import { secondaryUrls, limits } from '../utils/data';
import req from '../utils/req';
import fuzz from 'fuzzball';

export default class Temas extends Base {
  constructor(tableName) {
    super(tableName);
    this.vols = [];
    this.categories = {};
    this.editions = {};
  }

  clean() {
    return new Promise((resolve, reject) => {
      this.getThemes();
      let cleanedData = this.sortAndFilter(this.getBaseArray(this.data.raw));
      this.getVols(this.vols, this.totalRows);

      cleanedData = cleanedData.map(ref => {
        let cell = this.data.raw[ref.key];
        let titlePages = this.getTitleAndPages(cell.v, ref.key);
        let meta = this.vols.find(obj => ref.row >= obj.rows[0] && ref.row <= obj.rows[1]);
        let ret = {
          title: titlePages.title,
          category: [this.categories[ref.col]]
        };

        if (!meta) {
          this.setError({
            stop: true,
            error: {
              error: `Can't match edition number of cell ${ref.key} to anything`
            }
          });
        }

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

        Object.assign(ret, ref, meta);

        if (!this.editions.hasOwnProperty(`ed${ret.ed}`)) {
          this.editions[`ed${ret.ed}`] = [ret];
        } else {
          let matchArticle = this.editions[`ed${ret.ed}`].find((article, i) => {
            if (article.ed === ret.ed && fuzz.ratio(article.title, ret.title) > 95) {
              if (isArray(article.category)) {
                this.editions[`ed${ret.ed}`][i].category.push(ret.category);
              } else {
                this.editions[`ed${ret.ed}`][i].category = [article.category, ret.category];
              }
              console.log('repeated title', article, ret);
            }

            return false;
          });

          this.editions[`ed${ret.ed}`].push(ret);
        }

        return ret;
      });

      req(secondaryUrls.generos).then(d => {
        if (d.hasOwnProperty('Sheets') && d.Sheets.hasOwnProperty(this.sheetName)) {
          let generosData = d.Sheets[this.sheetName];
          let finalRow = this.getFinalRow(generosData);
          let baseArr = this.getBaseArray(generosData);
          let vols = [];
          let genres = [];
          let titles = {};
          let limit = limits.generos[this.sheetName];

          let cleaned = this.sortCells(baseArr).filter(obj => {
            if (obj.col > limit) {
              return false;
            }

            // Extract editions.
            if (obj.col === 'A') {
              if (obj.row !== 1) {
                let v = generosData[obj.key].v;
                let ed = !isNaN(v) ? +v : this.validatePages(v);
                vols.push(Object.assign(obj, {
                  ed: ed
                }));
              }
              return false;
            } else if (obj.col === 'B') {
              // Extract Titles
              if (obj.row !== 1) {
                titles[`row${obj.row}`] = this.getTitleAndPages(generosData[obj.key].v, obj.key);
              }
              return false;
            } else if (obj.row === 1) {
              // Extract genres names
              genres[obj.col] = generosData[obj.key].v.trim();
              return false;
            } else if (!generosData[obj.key].v) {
              // Skip if the the value is 0 since it means the title does not belong to genre.
              return false;
            }

            // this will return true only if it is a cell with number and is equal to 1
            return true;
          });

          this.getVols(vols, finalRow);

          // Match genres to each title
          cleaned = cleaned.forEach(ref => {
            let cell = generosData[ref.key];
            let meta = vols.find(obj => ref.row >= obj.rows[0] && ref.row <= obj.rows[1]);
            let article = titles[`row${ref.row}`];

            if (!meta) {
              this.setError({
                stop: true,
                error: {
                  error: `Can't match edition number of cell ${ref.key} to anything`
                }
              });
            }

            if (!article.hasOwnProperty('genres')) {
              article.genres = [];
            }

            article.genres.push(genres[ref.col]);

            Object.assign(article, meta);
          });

          // Remove empty articles
          for (let articleKey in titles) {
            if (!titles[articleKey].hasOwnProperty('genres')) {
              delete titles[articleKey];
            }
          }

          for (let articleKey in titles) {
            let article = titles[articleKey];

            let match = cleanedData.find(article2 => {
              if (article.ed !== article2.ed) {
                return false;
              }

              let ratio = fuzz.ratio(article2.title, article.title);

              if (ratio === 100) {
                article2.genres = article.genres;
                return true;
              } else if (ratio > 80) {
                this.setError({
                  error: {
                    warning: `These titles seem to match`,
                    Generos: `${article.title}" - ${articleKey}`,
                    Titulos: `${article2.title}" - ${article2.key}`
                  }
                });

                return false;
              }

              return false;
            });

            // TODO: what to do with articles that have genre,
            // but are excluded from the main titles, themes and categories table?
            if (!match) {
              //console.log(article);
            }
          }

          resolve(cleanedData);
        }
      });
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
