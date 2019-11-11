import React  from 'react'
import PropTypes from 'prop-types'
import fetch from 'isomorphic-fetch'
import Layout from '../components/frontend/Layout'
import { seo } from '../../site.config'
import { getString } from '../scripts/utils'
import { PageNavigation } from '../components/frontend/PageNavigation'

const dateParams = (() => {
    const nowDate = new Date()
    const year = nowDate.getFullYear()
    const month = nowDate.getMonth()
    const date = nowDate.getDate()
    const hour = nowDate.getHours()
    const minute = nowDate.getMinutes()
    const second = nowDate.getSeconds()
    const day = nowDate.getDay()

    const getTimeLeftString = (targetDate) => {
        let ts = +targetDate - nowDate.getTime()
        const d = Math.floor(ts / (24 * 60 * 60 * 1000))
        ts -= d * 24 * 60 * 60 * 1000
        const h = Math.floor(ts / (60 * 60 * 1000))
        ts -= h * 60 * 60 * 1000
        const m = Math.floor(ts / (60 * 1000))
        ts -= m * 60 * 1000
        const s = Math.floor(ts / 1000)
        return `${d}天${h}时${m}分${s}秒`
    }
    const timeLeftThisWeek = getTimeLeftString(new Date(
        +new Date(year, month, date + 1, 0, 0, 0) +
        (day === 0 ? 0 : (7 - day) * 24 * 60 * 60 * 1000)
    ))
    const timeLeftThisMonth = getTimeLeftString(new Date(year, month + 1, 1, 0, 0, 0))
    const timeLeftThisYear = getTimeLeftString(new Date(year + 1, 0, 1, 0, 0, 0))
    return {
        dateStr: `${year}年${month + 1}月${date}日 ${hour}:${minute}:${second}`,
        dayStr: `星期${['日', '一', '二', '三', '四', '五', '六'][day]}`,
        timeLeftThisWeek,
        timeLeftThisMonth,
        timeLeftThisYear,
    }
})()

const Index = (props) => {
    return (
        <Layout
            hideSiteMainTitle={true}
            pageTitle={''}
            keywords={seo.keywords}
            description={seo.description}>
            <p className="bg-warning">{`当前日期：${dateParams.dateStr}。距离本月结束还剩：${dateParams.timeLeftThisMonth}，距离本年结束还剩：${dateParams.timeLeftThisYear}。`}</p>
            <ul className="posts">
                {
                    props.posts.map((item) => (
                        <li key={item.id} className="post">
                            <header className="postHeader">
                                <a href={`/${item.slug}.html`} className="postTitle">{item.title}</a>
                                <small className="postDate">{(item.modified || item.date).replace(/T.*$/, '')}</small>
                            </header>
                            <article className="postExcerpt" dangerouslySetInnerHTML={{ __html: item.excerpt || item.content }} />
                        </li>
                    ))
                }
            </ul>

            <PageNavigation
                currentPage={props.pageNum}
                totalPages={props.totalPages}
            />

            <style jsx>{`
                .bg-warning {
                    padding: 10px;
                    border-radius: 6px;
                }

                .posts {
                    padding-left: 0;
                }
                .post {
                    display: block;
                    padding-top: 10px;
                    padding-bottom: 10px;
                }
                .post:nth-of-type(n+2) {
                    border-top: 1px dashed #7797a2;
                    margin-top: 10px;
                }
                .postHeader {
                    display: block;
                }
                .postHeader .postDate {
                    display: inline;
                    margin-left: 1em;
                }

                .pager {
                    margin-bottom: 60px;
                    text-align: left;
                }
                .pager > li:nth-of-type(n+2) {
                    margin-left: 6px;
                }
                .pager > li > a {
                    width: 140px;
                    padding: 10px 20px;
                    text-align: center;
                    border-radius: 30px;
                }
            `}</style>
            <style jsx global>{`
                .crayon-plain-wrap {
                    display: none;
                }
                p:nth-last-of-type(1) {
                    margin-bottom: 0;
                }
            `}</style>
        </Layout>
    )
}

Index.propTypes = {
    pageNum: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    posts: PropTypes.array.isRequired,
}

Index.getInitialProps = async ({ req }) => {
    const baseUrl = req ? `http://${req.headers.host}` : ''
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/posts?page=1&per_page=10`)
    const totalPages = res.headers.get('x-wp-totalpages') * 1
    const total = res.headers.get('x-wp-total') * 1
    const data = await res.json()
    return {
        pageNum: 1,
        totalPages,
        total,
        posts: data.map((item) => ({
            id: getString(item.id),
            date: getString(item.date),
            date_gmt: getString(item.date_gmt),
            modified: getString(item.modified),
            modified_gmt: getString(item.modified_gmt),
            slug:  getString(item.slug),
            status: getString(item.status),
            type: getString(item.type),
            link: getString(item.link),
            title: getString(item.title.rendered),
            content: getString(item.content.rendered),
            excerpt: getString(item.excerpt.rendered),
            author: getString(item.author),
            featured_media: getString(item.featured_media),
            comment_status: getString(item.comment_status),
            ping_status: getString(item.ping_status),
            sticky: getString(item.sticky),
            format: getString(item.format),
            categories: item.categories.map((d) => getString(d)),
            tags: item.tags.map((d) => getString(d)),
        })),
    }
}

export default Index
