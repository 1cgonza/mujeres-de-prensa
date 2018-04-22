module.exports = {
  extend: 'apostrophe-widgets',
  label: 'New Cartography',
  skipInitialModal: true,
  addFields: [
    {
      type: 'singleton',
      widgetType: 'apostrophe-images',
      name: 'carto',
      label: 'Image'
    }
  ],
};
