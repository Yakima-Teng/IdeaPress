const express = require('express')
const next = require('next')
const proxyMiddleware = require('http-proxy-middleware')
const {
    homePage,
    serverPort,
    proxyTable,
    frontendRoot,
    backendRoot,
} = require('./site.config')

const port = parseInt(process.env.PORT || serverPort, 10) || 8080
const env = process.env.NODE_ENV
const dev = env !== 'production'
const app = next({
    dir: './src', // base directory where everything is, could move to src later
    dev,
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

        server.get('/', (req, res) => {
            return app.render(req, res, '/frontend/index', {})
        })

        server.get('/:slug', (req, res) => {
            return app.render(req, res, '/frontend/[pageName]', { slug: req.params.slug })
        })

        server.get(`${frontendRoot}`, (req, res) => {
            return app.render(req, res, '/frontend/index', {})
        })

        server.get(`${frontendRoot}/:slug`, (req, res) => {
            return app.render(req, res, '/frontend/[pageName]', { slug: req.params.slug })
        })

        server.get(`${backendRoot}`, (req, res) => {
            return app.render(req, res, '/backend/index', {})
        })

        server.get(`${backendRoot}/:slug`, (req, res) => {
            return app.render(req, res, '/backend/[pageName]', { slug: req.params.slug })
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
