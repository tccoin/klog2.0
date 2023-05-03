module.exports = {
    apps: [{
        name: 'klog',
        script: 'server.js',
        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        node_args: '--experimental-fetch',
        instances: 1,
        autorestart: true,
        watch: ['build', 'routes'],
        watch_options: {
            'followSymlinks': true
        },
        max_memory_restart: '1G',
        env: {
            'NODE_NO_WARNINGS': '1'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }]
};
