module.exports = {
  extend: 'apostrophe-widgets',
  label: 'New Profile',
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
      name: 'publication',
      label: 'Revista'
    },
    {
      type: 'singleton',
      widgetType: 'apostrophe-rich-text',
      name: 'contentArea',
      label: 'Perfil'
    },
    {
      type: 'singleton',
      widgetType: 'apostrophe-images',
      name: 'profileImg',
      label: 'Imagen'
    }
  ],
};
