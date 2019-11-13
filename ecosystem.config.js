module.exports = {
    apps : [{
        name: 'IdeaPress',
        script: './server.js',

        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        args: 'one two',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '200M',
        env: { // pm2 start ecosystem.config.js
            NODE_ENV: 'development',
        },
        env_production: { // pm2 start ecosystem.config.js --env production
            NODE_ENV: 'production',
        },
    }],
}
