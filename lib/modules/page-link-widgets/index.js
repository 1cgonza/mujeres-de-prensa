module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Page',
  wrapperTemplate: 'wrapper',
  addFields: [
    {
      name: '_page',
      type: 'joinByOne',
      withType: 'apostrophe-page',
      label: 'Page',
      required: true,
      idField: 'pageId',
      filters: {
        projection: {
          title: 1,
          slug: 1,
          themeColor: 1
        }
      }
    }
  ]
};
