module.exports = {
  extend: 'apostrophe-widgets',
  label: 'New credit',
  skipInitialModal: true,
  addFields: [
    {
      type: 'singleton',
      widgetType: 'apostrophe-rich-text',
      name: 'name',
      label: 'Name',
    },
    {
      type: 'singleton',
      widgetType: 'apostrophe-rich-text',
      name: 'role',
      label: 'Role'
    },
    {
      type: 'singleton',
      widgetType: 'apostrophe-rich-text',
      name: 'description',
      label: 'Description'
    }
  ],
};
