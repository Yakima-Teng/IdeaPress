import React  from 'react'
import PropTypes from 'prop-types'
import Layout from '../components/Layout'
import { seo } from '../../site.config'
import {
    getString,
    trimHtml,
} from '../scripts/utils'
import { PageNavigation } from '../components/PageNavigation'
import { doGet } from '../scripts/fetch'
import { PostList } from '../components/PostList'
import { TimeLeft } from '../components/TimeLeft'

const Index = (props) => {
    return (
        <Layout
            hideSiteMainTitle={true}
            pageTitle={`${seo.siteMainTitle} ${seo.separator} ${seo.siteSubTitle}`}
            keywords={seo.keywords}
            description={seo.description}>

            <TimeLeft />

            <PostList posts={props.posts} />

            <PageNavigation
                currentPage={props.pageNum}
                totalPages={props.totalPages}
            />
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
