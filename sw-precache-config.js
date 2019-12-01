module.exports = {
  staticFileGlobs: [
  ],
  runtimeCaching: [
    {
      urlPattern: /\/static\//,
      handler: 'fastest',
      options: {
        cache: {
          name: 'static-files'
        }
      }
    },
    {
      urlPattern: /^https:\/\/storage\.krrr\.party\/storage\/klog-avatar\/.*/,
      handler: 'networkFirst',
      options: {
        cache: {
          name: 'data-storage-avatar'
        }
      }
    },
    {
      urlPattern: /https:\/\/storage\.krrr\.party\/storage\/klog2\/.*\?Magic\/1\/.*/,
      handler: 'cacheFirst',
      options: {
        cache: {
          name: 'data-storage-thumbnail'
        }
      }
    },
    {
      urlPattern: /https:\/\/storage\.krrr\.party\/storage\/klog2\/.*\?Magic\/6/,
      handler: 'cacheFirst',
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