const express = require('express')
const next = require('next')
const os = require('os')
const proxyMiddleware = require('http-proxy-middleware')
const {
    homePage,
    serverPort,
    proxyTable,
} = require('../site.config')

const port = parseInt(process.env.PORT || serverPort, 10) || 8080
const env = process.env.NODE_ENV
const dev = env !== 'production'
const app = next({
    dir: '.', // base directory where everything is, could move to src later
    dev
})

const handle = app.getRequestHandler()

let server
app
    .prepare()
    .then(() => {
        server = express()
        // Set up the proxy.
        Object.keys(proxyTable).forEach(function (context) {
            server.use(proxyMiddleware(context, proxyTable[context]))
        })

        // Default catch-all handler to allow Next.js to handle all other routes
        server.all('*', (req, res) => handle(req, res))

        server.listen(port, err => {
            if (err) {
                throw err
            }
            console.log(`> Ready on http://localhost:${port}${homePage} [${env}]`) // eslint-disable-line
        })
    })
    .catch(err => {
        console.log('An error occurred, unable to start the server') // eslint-disable-line
        console.log(err) // eslint-disable-line
    })