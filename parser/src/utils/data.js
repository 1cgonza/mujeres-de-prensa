const base = './data/';

export const urls = {
  lugares: `${base}Lugares.xlsx`,
  temas: `${base}TitulosYTemasSegunCatagorias.xlsx`
};

export const secondaryUrls = {
  generos: `${base}Generos.xlsx`,
  palabras: `${base}PalabrasRecurrentes.xlsx`,
};

export const metaUrls = {
  ediciones: `${base}MetaEdiciones.xlsx`
};

export const limits = {
  temas: {
    Mireya: 'H',
    AF: 'J',
    MF: 'J',
    Verdad: 'J',
    Contrastes: 'J',
    Mujer: 'J'
  },
  generos: {
    Mireya: 'I',
    AF: 'I',
    MF: 'I',
    Verdad: 'I',
    Contrastes: 'I',
    Mujer: 'I'
  }
};
