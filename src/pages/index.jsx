import React  from 'react'
import PropTypes from 'prop-types'
import Layout from '../components/Layout'
import { seo } from '../../site.config'
import { getString } from '../scripts/utils'
import { PageNavigation } from '../components/PageNavigation'
import { doGet } from '../scripts/fetch'
import { ExcerptList } from '../components/ExcerptList'

const Index = (props) => {
    return (
        <Layout
            blogName={props.blogName}
            blogDescription={props.blogDescription}
            beianCode={props.beianCode}
            hideSiteMainTitle={true}
            pageTitle={`${seo.siteMainTitle} ${seo.separator} ${seo.siteSubTitle}`}
            keywords={seo.keywords}
            description={seo.description}
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
    pageNum: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    posts: PropTypes.array.isRequired,
    categoryList: PropTypes.array.isRequired,
    months: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,
}

Index.getInitialProps = async ({ query }) => {
    const resForBlogInfo = await doGet('/api/v2/getBlogInfo')
    const dataForBlogInfo = await resForBlogInfo.json()
    const blogName = dataForBlogInfo.body.options.find((item) => item.option_name === 'blogname').option_value
    const blogDescription = dataForBlogInfo.body.options.find((item) => item.option_name === 'blogdescription').option_value
    const beianCode = dataForBlogInfo.body.options.find((item) => item.option_name === 'zh_cn_l10n_icp_num').option_value // 备案码（国内主机需要）
    const pageSize = dataForBlogInfo.body.options.find((item) => item.option_name === 'posts_per_page').option_value

    const resForPostsList = await doGet('/api/v2/postsList', {
        pageNum: query.pageNum * 1 || 1,
        pageSize,
    })
    const dataForPostsList = await resForPostsList.json()
    const pageNum = dataForPostsList.body.curNumOfPage
    const totalPages = dataForPostsList.body.totalNumOfPages
    const posts = dataForPostsList.body.posts

    const resForCategoryList = await doGet('/api/v2/categoryList')
    const dataForCategoryList = await resForCategoryList.json()
    const categoryList = (() => {
        const list = dataForCategoryList.body.categoryList
        const objRoots = {}
        const traverseNode = (node, item) => { // 遍历节点
            if (!node) { return false }
            if (node.term_id === item.parent) {
                if (!node.next) { node.next = {} }
                node.next[`t${item.term_id}`] = item
                return true // 表示成功找到父元素并将item挂载到父元素上
            }
            if (!node.next) { return false }
            const keys = Object.keys(node.next)
            for (let i = 0, len = keys.length; i < len; i++) {
                if (traverseNode(node.next[keys[i]], item)) {
                    return true
                }
            }
            return false
        }
        let count = 0
        while (list.length > 0) {
            for (let i = list.length - 1; i >= 0; i--) {
                count++
                if (count > 1000) {
                    throw new Error('Too many times')
                }
                const item = list[i]
                const parent = item.parent
                const term_id = item.term_id
                if (item.traverseCounter === void 0) {
                    item.traverseCounter = 0
                }
                item.traverseCounter++
                if (parent === 0) {
                    objRoots[`t${term_id}`] = item
                    list.splice(i, 1)
                } else if (item.traverseCounter > 100) { // 如果一个节点被遍历了100次还没找到父节点，就认为是原始数据有问题，直接将其作为根节点之一绑到objRoots上
                    objRoots[`t${term_id}`] = item
                    list.splice(i, 1)
                } else if (Object.keys(objRoots).filter((key) => traverseNode(objRoots[key], item)).length > 0) {
                    list.splice(i, 1)
                }
            }
        }
        const visitNode = (node) => {
            delete node.traverseCounter
            if (!node.next) {
                node.childs = []
                delete node.next
                return node
            }
            const childs = Object.keys(node.next).map((key) => node.next[key])
            delete node.next
            node.childs = childs.map((child) => visitNode(child))
            return node
        }
        return Object.keys(objRoots).map((key) => visitNode(objRoots[key]))
    })()

    const resForMonths = await doGet('/api/v2/getMonths')
    const dataForMonths = await resForMonths.json()
    const months = dataForMonths.body.months

    const resForLinks = await doGet('/api/v2/getLinks')
    const dataForLinks = await resForLinks.json()
    const links = dataForLinks.body.links

    return {
        blogName,
        blogDescription,
        beianCode,
        pageNum,
        totalPages,
        posts,
        categoryList,
        months,
        links,
    }
}

export default Index
