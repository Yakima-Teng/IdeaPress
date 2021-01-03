module.exports = {
    apps : [{
        name: 'IdeaPress',
        script: './node_modules/.bin/ts-node',
        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        args: ' ./server.ts',
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

        /**
         * 日志打印配置
         */
        error_file: 'logs/err.log',
        out_file: 'logs/out.log',
        log_file: 'logs/combined.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }],
}
