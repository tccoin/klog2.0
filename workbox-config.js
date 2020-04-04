exports.workboxConfig = {
  globDirectory: ".",
  globPatterns: [
    "./src/*.js",
    "./src/lib/*.js"
  ],
  swDest: "sw.js",
  runtimeCaching: [
    {
      urlPattern: /\/static\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-files'
      }
    },
    {
      urlPattern: /node_modules\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'node-modules'
      }
    },
    {
      urlPattern: /\src\/apps\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'klog-apps'
      }
    },
    {
      urlPattern: /^https:\/\/storage\.krrr\.party\/storage\/klog-avatar\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'storage-avatar',
        expiration: {
          maxEntries: 30
        }
      }
    },
    {
      urlPattern: /https:\/\/storage\.krrr\.party\/storage\/klog2\/.*\?Magic\/1\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'storage-thumbnail',
        expiration: {
          maxEntries: 30
        }
      }
    },
    {
      urlPattern: /https:\/\/storage\.krrr\.party\/storage\/klog2\/.*\?Magic\/6/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'storage-placeholder'
      }
    },
    {
      urlPattern: /https:\/\/us\.leancloud\.cn\/1\.1\/classes\.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'leancloud-data',
        expiration: {
          maxEntries: 20
        }
      }
    }
  ]
};