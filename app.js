var path = require('path');

var apos = require('apostrophe')({
  shortName: 'pasadoimpreso',
  modules: {
    'apostrophe-templates': {
      viewsFolderFallback: path.join(__dirname, 'views')
    },
    'apostrophe-express': {
      session: {
        secret: 'p@s@d0'
      }
    },
    'home-menu-widgets': {},
    'profiles-widgets': {},
    'credits-widgets': {},
    'projects-widgets': {},
    'magazines-widgets': {},
    'page-link-widgets': {},
    'gallery-widgets': {},
    'illustrations-widgets': {},
    'cartographies-widgets': {},
    'contact-form': {},
    'contact-form-widgets': {},
    'timeline': {},
    'timeline-widgets': {
      extend: 'apostrophe-pieces-widgets',
      filters: {
        projection: {
          title: 1,
          slug: 1,
          type: 1,
          eventType: 1,
          dateInit: 1,
          dateEnd: 1,
          periodicity: 1,
          distribution: 1,
          director: 1,
          place: 1,
          filiation: 1,
          audience: 1,
          text: 1,
          links: 1
        }
      }
    },
    'cartography-pages': {
      extend: 'apostrophe-custom-pages',
      name: 'cartography',
      arrangeFields: [
        {
          name: 'cartographyConfiguration',
          label: 'Cartography configuration',
          fields: ['cartoType']
        }
      ],
      addFields: [
        {
          type: 'select',
          name: 'cartoType',
          label: 'Type',
          choices: [
            {
              label: 'Lugares (mapa)',
              value: 'places'
            },
            {
              label: 'Temas, generos y palabras (General)',
              value: 'all'
            },
            {
              label: 'Gráfica',
              value: 'graphics'
            }
          ]
        }
      ]
    },
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
