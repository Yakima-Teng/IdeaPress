import React  from 'react'
import PropTypes from 'prop-types'
import Layout from '../../components/Layout'
import { seo } from '../../../site.config'
import { getString } from '../../scripts/utils'
import { PageNavigation } from '../../components/PageNavigation'
import { doGet } from '../../scripts/fetch'
import { ExcerptList } from '../../components/ExcerptList'

const Index = (props) => {
    return (
        <Layout
            hideSiteMainTitle={true}
            pageTitle={`${seo.siteMainTitle} ${seo.separator} ${seo.siteSubTitle}`}
            keywords={seo.keywords}
            description={seo.description}
            blogInfo={props.blogInfo}
            categoryList={props.categoryList}
            months={props.months}
            links={props.links}
        >
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
    blogInfo: PropTypes.object.isRequired,
    categoryList: PropTypes.array.isRequired,
    months: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,

    pageNum: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    posts: PropTypes.array.isRequired,
}

Index.getInitialProps = async ({ query }) => {
    const resForBasicInfo = await doGet('/api/v2/getBasicInfo')
    const dataForBasicInfo = await resForBasicInfo.json()
    const pageSize = dataForBasicInfo.body.blogInfo.posts_per_page

    const resForPostsList = await doGet('/api/v2/getPostsList', {
        pageNum: query.pageNum * 1 || 1,
        pageSize,
    })
    const dataForPostsList = await resForPostsList.json()
    const pageNum = dataForPostsList.body.curNumOfPage
    const totalPages = dataForPostsList.body.totalNumOfPages
    const posts = dataForPostsList.body.posts

    return {
        blogInfo: dataForBasicInfo.body.blogInfo,
        categoryList: dataForBasicInfo.body.categoryList,
        months: dataForBasicInfo.body.months,
        links: dataForBasicInfo.body.links,
        pageNum,
        totalPages,
        posts,

    }
}

export default Index
