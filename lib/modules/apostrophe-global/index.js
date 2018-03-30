module.exports = {
  arrangeFields: [
    {
      name: 'basics',
      label: 'Basics',
      fields: ['projectTitle', 'siteTitle']
    },
    {
      name: 'seo',
      label: 'Site SEO',
      fields: ['ogImage', 'ogDescription', 'analytics', 'twitterSite']
    }
  ],
  addFields: [
    {
      type: 'string',
      name: 'projectTitle',
      label: 'Project name'
    },
    {
      type: 'string',
      name: 'siteTitle',
      label: 'Site name'
    },
    {
      type: 'string',
      name: 'analytics',
      label: 'Google Analytics Property ID (like UA-xxxxx)'
    },
    {
      type: 'string',
      name: 'twitterSite',
      label: 'Twitter handle (i.e. @UserName)'
    },
    {
      type: 'string',
      name: 'ogDescription',
      label: 'Site description',
      textarea: true,
      max: 320
    },
    {
      type: 'singleton',
      widgetType: 'apostrophe-images',
      name: 'ogImage',
      label: 'Open Graph image',
      help: 'Image used by social media sites. This one set in the "Global" options is the default image to be use as backup if a page does not have an \"Open Graph\" image.',
      options: {
        limit: 1,
        size: 'full',
        controls: {
          movable: false
        }
      }
    }
  ]
};
