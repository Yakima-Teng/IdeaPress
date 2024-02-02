require('dotenv').config()

const { SERVER_NAME, SERVER_PORT } = process.env

module.exports = {
  apps: [
    {
      name: SERVER_NAME,
      port: Number(SERVER_PORT),
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
