import { magazines } from './constants';

export default class Store {
  constructor(data) {
    this._rawData = data;
    this.data = data;
    this.extProcedencia = [];
    this.natProcedencia = [];
    this.extMencion = [];
    this.natMencion = [];
    this.separateData();
  }

  separateData() {
    this._rawData.forEach(place => {
      if (place.name.indexOf('Colombia') < 0) {
        if (place.hasOwnProperty('procedencia')) {
          this.extProcedencia.push(this.cleanPlace(place, 'procedencia'));
        } else if (place.hasOwnProperty('mencion')) {
          this.extMencion.push(this.cleanPlace(place, 'mencion'));
        }
      } else {
        if (place.hasOwnProperty('procedencia')) {
          this.natProcedencia.push(this.cleanPlace(place, 'procedencia'));
        } else if (place.hasOwnProperty('mencion')) {
          this.natMencion.push(this.cleanPlace(place, 'mencion'));
        }
      }
    });
  }

  cleanPlace(place, key) {
    let mag = {};

    place[key].forEach(node => {
      if (!mag.hasOwnProperty(node.revista)) {
        mag[node.revista] = [];
      }
      mag[node.revista].push(node);
    });

    return {
      name: place.name,
      lng: place.lng,
      lat: place.lat,
      magazines: mag
    };
  }
}
