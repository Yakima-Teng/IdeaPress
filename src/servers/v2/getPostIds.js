import { promiseQuery } from '../../scripts/sql'
import { getString } from '../../scripts/utils'
import { getCategoryList } from './getCategoryList'

export const getPostIds = async (params) => {
    if (params.type === 'category') { // 查询某分类下的文章（包括子分类下的文章）
        const categoryList = await getCategoryList()
        const lastCatSlug = params.cats.split(',').reverse()[0]
        const lastCat = categoryList.find((item) => item.slug === lastCatSlug)
        const lastCatId = getString(lastCat.term_id)
        const catIds = [lastCatId]

        if (lastCat.childs && lastCat.childs.length > 0) {
            lastCat.childs.forEach((item) => catIds.push(getString(item.term_id)))
        }

        return (await promiseQuery(
            'SELECT wp_posts.ID ' +
            'FROM wp_posts ' +
            'JOIN wp_term_relationships ON (wp_posts.ID = object_id) ' +
            'JOIN wp_term_taxonomy USING (term_taxonomy_id) ' +
            'JOIN wp_terms USING (term_id) ' +
            `WHERE term_id in ("${catIds.join('","')}") AND wp_posts.post_type = 'post' AND wp_posts.post_status = 'publish' ` +
            `ORDER BY wp_posts.post_date DESC LIMIT ${params.offset}, ${params.limit};`
        )).map((item) => getString(item.ID))
    }

    if (params.type === 'archive') { // 查询某月份下的文章

    }

    // 查询所有文章
    return (await promiseQuery(
        'SELECT wp_posts.ID ' +
        'FROM wp_posts ' +
        'WHERE wp_posts.post_type = \'post\' AND (wp_posts.post_status = \'publish\') ' +
        `ORDER BY wp_posts.post_date DESC LIMIT ${params.offset}, ${params.limit};`
    )).map((item) => getString(item.ID))
}
