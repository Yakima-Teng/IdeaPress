import React  from 'react'
import PropTypes from 'prop-types'
import Layout from '../components/Layout'
import { seo } from '../../site.config'
import { getString } from '../scripts/utils'
import { PageNavigation } from '../components/PageNavigation'
import { doGet } from '../scripts/fetch'
import { TimeLeft } from '../components/TimeLeft'
import { ExcerptList } from '../components/ExcerptList'

const Index = (props) => {
    return (
        <Layout
            hideSiteMainTitle={true}
            pageTitle={`${seo.siteMainTitle} ${seo.separator} ${seo.siteSubTitle}`}
            keywords={seo.keywords}
            description={seo.description}>

            <TimeLeft />

            <ExcerptList
                posts={props.posts.map((item) => ({
                    id: getString(item.ID),
                    slug: item.post_name,
                    title: item.post_title,
                    modified: item.post_modified,
                    date: item.post_date,
                    excerpt: item.post_excerpt || item.post_content,
                    category: item.category.map((d) => ({
                        term_id: getString(d.term_id),
                        name: getString(d.name),
                        slug: getString(d.slug),
                    })),
                    post_tag: item.post_tag,
                    post_format: item.post_format,
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
    posts: PropTypes.array.isRequired,
}

Index.getInitialProps = async () => {
    const res = await doGet('/api/v2/postsList', {
        pageNum: 1,
        pageSize: 10,
    })
    const data = await res.json()
    const body = data.body
    return {
        pageNum: body.curNumOfPage,
        totalPages: body.totalNumOfPages,
        posts: body.posts,
    }
}

export default Index
