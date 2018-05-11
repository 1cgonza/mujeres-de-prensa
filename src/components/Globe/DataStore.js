import { magazines } from './constants';

export default class Store {
  constructor(data) {
    this._rawData = data;
    this.data = data;
    this.extProcedencia = [];
    this.natProcedencia = [];
    this.extMencion = [];
    this.natMencion = [];

    data.forEach(place => {
      if (place.name.indexOf('Colombia') < 0) {
        if (place.hasOwnProperty('procedencia')) {
          this.extProcedencia.push(this.separateData(place, 'procedencia'));
        } else if (place.hasOwnProperty('mencion')) {
          this.extMencion.push(this.separateData(place, 'mencion'));
        }
      } else {
        if (place.hasOwnProperty('procedencia')) {
          this.natProcedencia.push(this.separateData(place, 'procedencia'));
        } else if (place.hasOwnProperty('mencion')) {
          this.natMencion.push(this.separateData(place, 'mencion'));
        }
      }
    });
  }

  separateData(place, key) {
    let ret = {
      name: place.name,
      lng: place.lng,
      lat: place.lat,
      magazines: {}
    };

    place[key].forEach(node => {
      if (!ret.magazines.hasOwnProperty(node.revista)) {
        ret.magazines[node.revista] = [];
      }
      ret.magazines[node.revista].push(node);
    });

    return ret;
  }
}
