module.exports = {
  extend: 'apostrophe-widgets',
  label: 'New Project',
  addFields: [
    {
      type: 'url',
      name: 'link',
      label: 'Link',
    },
    {
      type: 'boolean',
      name: 'linkOut',
      label: 'Link to new window?'
    },
    {
      type: 'singleton',
      widgetType: 'apostrophe-images',
      name: 'projectImg',
      label: 'Imagen'
    }
  ],
};
