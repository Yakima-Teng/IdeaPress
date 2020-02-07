import { promiseQuery } from '../../scripts/sql'
import { getString } from '../../scripts/utils'
import { POST_LIST_TYPE } from '../../scripts/data'

export const subClauseForQueryingPostIdsInSpecificCategory = ({ categoryIds }) => (
    'FROM wp_posts ' +
    'JOIN wp_term_relationships ON (wp_posts.ID = object_id) ' +
    'JOIN wp_term_taxonomy USING (term_taxonomy_id) ' +
    'JOIN wp_terms USING (term_id) ' +
    `WHERE term_id in ("${categoryIds.join('","')}") AND wp_posts.post_type = 'post' AND wp_posts.post_status = 'publish' `
)

export const subClauseForQueryingPostIdsInSpecificMonth = ({ year, month }) => (
    'FROM wp_posts ' +
    `WHERE YEAR(wp_posts.post_date) = ${year} AND MONTH(wp_posts.post_date) = ${month} ` +
    'AND wp_posts.post_type = \'post\' ' +
    'AND wp_posts.post_status = \'publish\' '
)

export const subClauseForQueryingPostIdsForGlobal = () => (
    'FROM wp_posts ' +
    'WHERE wp_posts.post_type = \'post\' AND (wp_posts.post_status = \'publish\') '
)

export const getPostIds = async (params) => {
    if (params.type === POST_LIST_TYPE.CATEGORY) { // 查询某分类下的文章（包括子分类下的文章）
        return (await promiseQuery(
            'SELECT wp_posts.ID ' +
            subClauseForQueryingPostIdsInSpecificCategory({ categoryIds: params.categoryIds }) +
            `ORDER BY wp_posts.post_date DESC LIMIT ${params.offset}, ${params.limit};`
        )).map((item) => getString(item.ID))
    }

    if (params.type === POST_LIST_TYPE.ARCHIVE) { // 查询某月份下的文章
        return (await promiseQuery(
            'SELECT wp_posts.ID ' +
            subClauseForQueryingPostIdsInSpecificMonth({ year: params.year, month: params.month }) +
            `ORDER BY wp_posts.post_date DESC LIMIT ${params.offset}, ${params.limit};`
        )).map((item) => getString(item.ID))
    }

    // 查询所有文章
    return (await promiseQuery(
        'SELECT wp_posts.ID ' +
        subClauseForQueryingPostIdsForGlobal() +
        `ORDER BY wp_posts.post_date DESC LIMIT ${params.offset}, ${params.limit};`
    )).map((item) => getString(item.ID))
}
