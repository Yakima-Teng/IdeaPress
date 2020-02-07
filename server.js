const express = require('express')
const next = require('next')
const { parse } = require('url')
const proxyMiddleware = require('http-proxy-middleware')
const {
    serverPort,
    proxyTable,
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

        // Default catch-all handler to allow Next.js to handle all other routes
        server.all('*', (req, res) => {
            // Be sure to pass `true` as the second argument to `url.parse`.
            // This tells it to parse the query portion of the URL.
            const parsedUrl = parse(req.url, true)
            const { pathname, query } = parsedUrl

            if (pathname === '/') { // 首页
                app.render(req, res, '/templates/postList', {
                    ...query,
                    type: 'global',
                    pageNum: '1',
                })
                return
            }

            if (/^\/page\/[0-9]+$/.test(pathname)) { // 首页之后的页面
                const pageNum = pathname.match(/(?<=^\/page\/)[0-9]+$/)[0]
                app.render(req, res, '/templates/postList', {
                    ...query,
                    type: 'global',
                    pageNum,
                })
                return
            }

            if (/^\/category\/[^.]+$/.test(pathname)) { // 指定目录下的文章
                const cats = pathname.split('/page/')[0].replace('/category/', '').split('/')
                const pageNum = pathname.split('/page/')[1] || '1'
                app.render(req, res, '/templates/postList', {
                    ...query,
                    type: 'category',
                    cats,
                    pageNum,
                })
                return
            }

            if (/^\/[0-9]{4}\/[0-9]{2}(\/[0-9]+)?$/.test(pathname)) { // 指定月份的文章
                const year = pathname.split('/')[1]
                const month = pathname.split('/')[2]
                const pageNum = pathname.split('/')[3] || '1'
                app.render(req, res, '/templates/postList', {
                    ...query,
                    type: 'archive',
                    year,
                    month,
                    pageNum,
                })
                return
            }

            if (/^\/[^./\\]+\.html$/.test(pathname)) { // 文章详情页（url以.html结尾）
                const postName = pathname.match(/(?<=^\/).+(?=\.html$)/)[0]
                const postType = 'post'
                app.render(req, res, '/templates/post', {
                    ...query,
                    postName,
                    postType,
                })
                return
            }

            if (/^\/[^./\\]+$/.test(pathname)) { // 页面详情页(url不含"."、"\"和"/"——除了最开头的根路径斜杠)
                const postName = pathname.match(/(?<=^\/).+$/)[0]
                const postType = 'page'
                app.render(req, res, '/templates/post', {
                    ...query,
                    postName,
                    postType,
                })
                return
            }

            handle(req, res, parsedUrl)
        })

        server.listen(port, err => {
            if (err) {
                throw err
            }
            console.log(`> Ready on http://localhost:${port} [${env}]`) // eslint-disable-line
        })
    })
    .catch(err => {
        console.log('An error occurred, unable to start the server') // eslint-disable-line
        console.log(err) // eslint-disable-line
    })
