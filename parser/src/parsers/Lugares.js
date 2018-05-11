import Base from './Base';

export default class Lugares extends Base {
  constructor(tableName, data, meta) {
    super(tableName);
    this.sheets = data.SheetNames.filter(name => name !== 'Lugares');
    this.places = this.cleanPlaces(data.Sheets.Lugares);

    this.sheets.forEach(name => {
      let db = data.Sheets[name];
      let base = this.sortCells(this.getBaseArray(data.Sheets[name]));
      let magMeta = this.cleanMeta(meta[name]);
      let eds = [];
      let tablePlaces = [];

      base = base.filter(cell => {
        if (cell.col === 'A') {
          if (cell.row === 1) {
            return false;
          }
          let ed = magMeta.find(ed => {
            let cellVal = db[cell.key].v;
            let groupEd = !isNaN(cellVal) ? +cellVal : this.validatePages(db[cell.key].v)[0];
            let num = Array.isArray(ed.ed) ? ed.ed[0] : ed.ed;
            return groupEd === num;
          });
          eds.push(ed);
          return false;
        } else if (cell.col === 'B') {
          return false;
        } else if (cell.row === 1) {
          tablePlaces.push(this.places.find(pl => pl.id === db[cell.key].v));
          return false;
        }

        return true;
      });

      let col = 'C';
      let currentPlaceI = 0;
      let currentEdI = 0;

      for (let i = 0; i < base.length; i += 3) {
        if (col !== base[i].col) {
          col = base[i].col;
          currentPlaceI++;
          currentEdI = 0;
        }
        let pi = this.places.findIndex(pl => pl.id === tablePlaces[currentPlaceI].id);
        let mencionEditorial = db[base[i].key].v;
        let procedencia = db[base[i + 1].key].v;
        let mencionAleatoria = db[base[i + 2].key].v;
        let d = {
          revista: name,
          ed: eds[currentEdI]
        };

        if (mencionEditorial || mencionAleatoria) {
          this.addNode(pi, 'mencion', d);
        }

        if (procedencia) {
          this.addNode(pi, 'procedencia', d);
        }

        currentEdI++;
      }
    });

    this.createFile(this.places, `${this.tableName}`);
    console.log(this.places);
  }

  addNode(i, key, data) {
    if (!this.places[i].hasOwnProperty(key)) {
      this.places[i][key] = [];
    }
    this.places[i][key].push(data);
  }

  clean() {}

  cleanPlaces(data) {
    let base = this.sortCells(this.getBaseArray(data));
    let places = [];

    base.forEach(cell => {
      if (cell.row !== 1) {
        let placeI = cell.row - 2;
        let val = data[cell.key].v;

        if (cell.col === 'A') {
          places[placeI] = {id: val};
        } else if (cell.col === 'B') {
          places[placeI].name = val.trim();
        } else if (cell.col === 'C') {
          if (!places[placeI].name) {
            places[placeI].name = val.trim();
          } else {
            places[placeI].name = `${places[placeI].name}, ${val.trim()}`;
          }
        } else if (cell.col === 'D') {
          places[placeI].lng = val;
        } else if (cell.col === 'E') {
          places[placeI].lat = val;
        }
      }
    });

    return places;
  }
}
