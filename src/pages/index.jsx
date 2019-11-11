import React  from 'react'
import PropTypes from 'prop-types'
import Layout from '../components/frontend/Layout'
import { seo } from '../../site.config'
import {
    getString,
    getTimeLeft,
    trimHtml,
} from '../scripts/utils'
import { PageNavigation } from '../components/frontend/PageNavigation'
import { doGet } from '../scripts/fetch'

const dateParams = getTimeLeft()

const Index = (props) => {
    return (
        <Layout
            hideSiteMainTitle={true}
            pageTitle={`${seo.siteMainTitle} ${seo.separator} ${seo.siteSubTitle}`}
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

Index.getInitialProps = async () => {
    const res = await doGet('/wp-json/wp/v2/posts', {
        page: '1',
        per_page: '10',
    })
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
            excerpt: trimHtml(getString(item.excerpt.rendered)).html,
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
