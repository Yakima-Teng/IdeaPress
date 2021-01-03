import express from 'express'
import next from 'next'
import { parse }  from 'url'
import proxyMiddleware from 'http-proxy-middleware'
import {
    SERVER_PORT, PROXY_TABLE,
} from './src/site.config'
import { POST_LIST_TYPE } from './src/scripts/data'
import nextConfig from './next.config'

const port = parseInt(process.env.PORT || SERVER_PORT, 10) || 8080
const env = process.env.NODE_ENV
const dev = env !== 'production'
const app = next({
    dir: './src', // base directory where everything is, could move to src later
    dev,
    quiet: !dev,
    conf: nextConfig,
})

const handle = app.getRequestHandler()

app
    .prepare()
    .then(() => {
        const server = express()

        // Set up the proxy.
        Object.keys(PROXY_TABLE).forEach(function (context: string) {
            server.use(proxyMiddleware(context, PROXY_TABLE[context]))
        })

        // Default catch-all handler to allow Next.js to handle all other routes
        server.all('*', (req, res) => {
            // Be sure to pass `true` as the second argument to `url.parse`.
            // This tells it to parse the query portion of the URL.
            const parsedUrl = parse(req.url, true)
            const { pathname, query } = parsedUrl

            if (pathname === '/') { // 前台首页
                app.render(req, res, '/templates/postList', {
                    ...query,
                    type: POST_LIST_TYPE.GLOBAL,
                    pageNum: '1',
                })
                return
            }

            if (pathname === '/admin') { // 后台首页
                app.render(req, res, '/templates/admin/index', {})
                return
            }

            if (pathname !== null && /^\/page\/[0-9]+$/.test(pathname)) { // 首页之后的页面
                // const pageNum = pathname.match(/(?<=^\/page\/)[0-9]+$/)[0]
                const pageNum = pathname.match(/[0-9]+/)
                app.render(req, res, '/templates/postList', {
                    ...query,
                    type: POST_LIST_TYPE.GLOBAL,
                    pageNum: pageNum ? pageNum[0] : '1',
                })
                return
            }

            if (pathname !== null && /^\/category\/[^.]+(\/page\/[0-9]+)?$/.test(pathname)) { // 指定目录下的文章
                const cats = pathname.split('/page/')[0].replace('/category/', '').split('/')
                const pageNum = pathname.split('/page/')[1] || '1'
                app.render(req, res, '/templates/postList', {
                    ...query,
                    type: POST_LIST_TYPE.CATEGORY,
                    cats: cats.join(','),
                    pageNum,
                })
                return
            }

            if (pathname !== null && /^\/[0-9]{4}\/[0-9]{2}(\/page\/[0-9]+)?$/.test(pathname)) { // 指定月份的文章
                const year = pathname.split('/')[1]
                const month = pathname.split('/')[2]
                const pageNum = pathname.split('/page/')[1] || '1'
                app.render(req, res, '/templates/postList', {
                    ...query,
                    type: POST_LIST_TYPE.ARCHIVE,
                    year,
                    month,
                    pageNum,
                })
                return
            }

            if (pathname !== null && /^\/[^./\\]+\.html$/.test(pathname)) { // 文章详情页（url以.html结尾）
                const postName = ((p) => (p === null ? '' : p[0]))(pathname.match(/(?<=^\/).+(?=\.html$)/))
                const postType = 'post'
                app.render(req, res, '/templates/post', {
                    ...query,
                    postName,
                    postType,
                })
                return
            }

            if (pathname !== null && /^\/[^./\\]+$/.test(pathname)) { // 页面详情页(url不含"."、"\"和"/"——除了最开头的根路径斜杠)
                const postName = ((p) => (p === null ? '' : p[0]))(pathname.match(/(?<=^\/).+$/))
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
