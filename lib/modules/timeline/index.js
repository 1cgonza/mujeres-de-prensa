var months = require('./options/months');
var events = require('./options/events');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'timelineEvent',
  label: 'Timeline Event',
  pluralLabel: 'Timeline Events',
  arrangeFields: [
    {
      name: 'eventMeta',
      label: 'Event Metadata',
      fields: [
        'eventType', 'dateInit', 'dateEnd',
        'periodicity', 'distribution', 'director',
        'place', 'filiation', 'audience', 'text', 'links'
      ]
    }
  ],
  addFields: [
    {
      type: 'select',
      name: 'eventType',
      label: 'Tipo',
      choices: events
    },
    {
      type: 'array',
      name: 'dateInit',
      label: 'Fecha inicio',
      limit: 1,
      listItemTemplate: 'timeline:metaDate.html',
      schema: [
        {
          type: 'select',
          name: 'month',
          label: 'Mes',
          choices: months
        },
        {
          type: 'integer',
          name: 'year',
          label: 'Año'
        },
        {
          type: 'boolean',
          name: 'decade',
          label: '¿Decada?'
        }
      ]
    },
    {
      type: 'array',
      name: 'dateEnd',
      label: 'Fecha finalización',
      limit: 1,
      listItemTemplate: 'timeline:metaDate.html',
      schema: [
        {
          type: 'select',
          name: 'month',
          label: 'Mes',
          choices: months
        },
        {
          type: 'integer',
          name: 'year',
          label: 'Año'
        }
      ]
    },
    {
      type: 'string',
      name: 'periodicity',
      label: 'Frecuencia'
    },
    {
      type: 'string',
      name: 'distribution',
      label: 'Distribución'
    },
    {
      type: 'array',
      name: 'director',
      label: 'Director / Editor (a)',
      listItemTemplate: 'timeline:metaDirector.html',
      schema: [
        {
          type: 'string',
          name: 'name',
          label: 'Nombre'
        }
      ]
    },
    {
      type: 'array',
      name: 'place',
      label: 'Lugar',
      listItemTemplate: 'timeline:metaPlace.html',
      schema: [
        {
          type: 'string',
          name: 'city',
          label: 'Ciudad'
        },
        {
          type: 'string',
          name: 'country',
          label: 'País'
        }
      ]
    },
    {
      type: 'string',
      name: 'filiation',
      label: 'Filiación'
    },
    {
      type: 'string',
      name: 'audience',
      label: 'Público'
    },
    {
      type: 'singleton',
      widgetType: 'apostrophe-rich-text',
      name: 'text',
      label: 'Texto',
      options: {
        toolbar: ['Font', '/',
          'Styles', 'Bold', 'Italic', 'Blockquote', '-',
          'Link', 'Unlink', 'Anchor', '-',
          'BulletedList', 'NumberedList', '-',
          'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-',
          'Undo', 'Redo', '-',
          'Sourcedialog'
        ],
        styles: [
          {name: 'Title', element: 'h1', attributes: {class: 'styleTitle'}},
          {name: 'Subtitle', element: 'h2', attributes: {class: 'styleSubtitle'}},
          {name: 'Quote', element: 'span', attributes: {class: 'styleQuote'}},
          {name: 'Smaller', element: 'span', attributes: {class: 'styleSmaller'}}
        ]
      }
    },
    {
      type: 'array',
      name: 'links',
      label: 'Enlaces',
      listItemTemplate: 'timeline:metaLinks.html',
      schema: [
        {
          type: 'url',
          name: 'url',
          label: 'URL'
        },
        {
          type: 'string',
          name: 'name',
          label: 'Nombre'
        }
      ]
    }
  ],
};
