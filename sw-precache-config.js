module.exports = {
  staticFileGlobs: [
    'manifest.json',
    'bower_components/**/*',
    'node_modules/**/*',
    'static/**/*',
    'favicon.ico',
    'https://cdn.wilddog.com/sdk/js/2.5.6/wilddog-auth.js',
    'https://cdn1.lncld.net/static/js/3.1.0/av-min.js',
  ],
  runtimeCaching: [
    {
      urlPattern: /https:\/\/storage\.krrr\.party\/storage\/klog-avatar\/.*/,
      handler: 'fastest',
      options: {
        cache: {
          name: 'data-storage-avatar'
        }
      }
    },
    {
      urlPattern: /https:\/\/storage\.krrr\.party\/storage\/klog2\/.*\?Magic\/1\/.*/,
      handler: 'fastest',
      options: {
        cache: {
          name: 'data-storage-thumbnail'
        }
      }
    },
    {
      urlPattern: /https:\/\/storage\.krrr\.party\/storage\/klog2\/.*\?Magic\/6/,
      handler: 'fastest',
      options: {
        cache: {
          name: 'data-storage-placeholder'
        }
      }
    },
    {
      urlPattern: /https:\/\/us\.leancloud\.cn\/1\.1\/classes\.*/,
      handler: 'networkFirst',
      options: {
        cache: {
          maxEntries: 100,
          name: 'data-cache'
        }
      }
    }
  ]
};