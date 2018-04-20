module.exports = {
  extend: 'apostrophe-widgets',
  label: 'New Gallery Image',
  skipInitialModal: true,
  wrapperTemplate: 'wrapper',
  addFields: [
    {
      type: 'singleton',
      widgetType: 'apostrophe-images',
      name: 'galleryImg',
      label: 'Image'
    }
  ]
};
