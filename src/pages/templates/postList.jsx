import React  from 'react'
import PropTypes from 'prop-types'
import Layout from '../../components/Layout'
import { seo } from '../../../site.config'
import { getString } from '../../scripts/utils'
import { PageNavigation } from '../../components/PageNavigation'
import { doGet } from '../../scripts/fetch'
import { ExcerptList } from '../../components/ExcerptList'
import { POST_LIST_TYPE } from '../../scripts/data'

const PostList = (props) => {
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
            randomPosts={props.randomPosts}
            randomComments={props.randomComments}
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
                basePath={props.basePath}
                currentPage={props.pageNum}
                totalPages={props.totalPages}
            />
        </Layout>
    )
}

PostList.propTypes = {
    blogInfo: PropTypes.object.isRequired,
    categoryList: PropTypes.array.isRequired,
    months: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,
    randomPosts: PropTypes.array.isRequired,
    randomComments: PropTypes.array.isRequired,

    pageNum: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    posts: PropTypes.array.isRequired,
    basePath: PropTypes.string.isRequired,
}

PostList.getInitialProps = async ({ query, asPath }) => {
    const resForBasicInfo = await doGet('/api/v2/getBasicInfo')
    const dataForBasicInfo = await resForBasicInfo.json()
    const {
        blogInfo, categoryList, months, links, randomPosts, randomComments,
    } = dataForBasicInfo.body
    const pageSize = blogInfo.posts_per_page

    const params = {
        type: query.type || POST_LIST_TYPE.GLOBAL,
        pageNum: query.pageNum * 1 || 1,
        pageSize,
    }
    if (query.type === POST_LIST_TYPE.CATEGORY) {
        params.cats = query.cats.join(',')
    }
    if (query.type === POST_LIST_TYPE.ARCHIVE) {
        params.year = query.year
        params.month = query.month
    }
    const resForPostsList = await doGet('/api/v2/getPostsList', params)
    const dataForPostsList = await resForPostsList.json()
    const pageNum = dataForPostsList.body.curNumOfPage
    const totalPages = dataForPostsList.body.totalNumOfPages
    const posts = dataForPostsList.body.posts
    const basePath = asPath.split('/page/')[0]

    return {
        blogInfo,
        categoryList,
        months,
        links,
        randomPosts,
        randomComments,

        pageNum,
        totalPages,
        posts,
        basePath,
    }
}

export default PostList
