module.exports = {
    extend: 'apostrophe-widgets',
    label: 'New Illustrated Review',
    skipInitialModal: true,
    addFields: [
      {
        type: 'singleton',
        widgetType: 'apostrophe-rich-text',
        name: 'title',
        label: 'Title',
        required: true
      },
      {
        type: 'singleton',
        widgetType: 'apostrophe-rich-text',
        name: 'by',
        label: 'Written By'
      },
      {
        type: 'singleton',
        widgetType: 'apostrophe-rich-text',
        name: 'contentArea',
        label: 'Review'
      },
      {
        type: 'singleton',
        widgetType: 'apostrophe-images',
        name: 'illustration',
        label: 'Illustration'
      }
    ]
  };
