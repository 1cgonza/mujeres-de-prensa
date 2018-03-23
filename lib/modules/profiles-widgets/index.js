module.exports = {
  extend: 'apostrophe-widgets',
  label: 'New Profile',
  skipInitialModal: true,
  addFields: [
    {
      type: 'string',
      name: 'name',
      label: 'Name',
      required: true
    },
    {
      type: 'string',
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
