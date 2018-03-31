module.exports = {
  extend: 'apostrophe-widgets',
  label: 'New Magazine',
  skipInitialModal: true,
  addFields: [
    {
      type: 'singleton',
      widgetType: 'apostrophe-rich-text',
      name: 'name',
      label: 'Name',
      required: true
    },
    {
      type: 'singleton',
      widgetType: 'apostrophe-rich-text',
      name: 'contentArea',
      label: 'Content'
    },
    {
      type: 'singleton',
      widgetType: 'apostrophe-images',
      name: 'profileImg',
      label: 'Image'
    }
  ],
};
