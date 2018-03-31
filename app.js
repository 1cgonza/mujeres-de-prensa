var path = require('path');

var apos = require('apostrophe')({
  shortName: 'pasadoimpreso',
  modules: {
    'apostrophe-templates': {
      viewsFolderFallback: path.join(__dirname, 'views')
    },
    'profiles-widgets': {},
    'magazines-widgets': {},
    'link-widgets': {},
    'page-link-widgets': {},
    'illustrations-widgets': {},
    'theme-pages': {
      extend: 'apostrophe-custom-pages',
      name: 'seccion-tematica',
      arrangeFields: [
        {
          name: 'sectionConfiguration',
          label: 'Section configuration',
          fields: ['themeColor', 'themeType']
        }
      ],
      addFields: [
        {
          name: 'themeColor',
          type: 'color',
          label: 'Theme Color'
        },
        {
          type: 'select',
          name: 'themeType',
          label: 'Section',
          choices: [
            {
              label: 'La mujer tiene Derecho a intervenir',
              value: 'calle'
            },
            {
              label: 'Lo que vemos las mujeres',
              value: 'mesa'
            },
            {
              label: 'Cuéntame tu vida',
              value: 'casa'
            },
            {
              label: 'Toda obra tiene su principio',
              value: 'taller'
            }
          ]
        }
      ]
    }
  }
});
