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

            <PostList
                posts={props.posts.map((item) => ({
                    id: getString(item.ID),
                    slug: item.post_name,
                    title: item.post_title,
                    modified: item.post_modified,
                    date: item.post_date,
                    excerpt: item.post_excerpt || trimHtml(item.post_content).html,
                    content: item.post_content,
                }))}
            />

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
    const res = await doGet('/api/v2/postsList')
    const data = await res.json()
    const body = data.body
    return {
        pageNum: body.curNumOfPage,
        totalPages: body.totalNumOfPages,
        total: body.totalNumOfPosts,
        posts: body.posts,
    }
}

export default Index
