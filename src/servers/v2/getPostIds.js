import { promiseQuery } from '../../scripts/sql'
import { getString } from '../../scripts/utils'

export const getPostIds = async (params) => {
    if (params.type === 'category') {} // TODO

    if (params.type === 'archive') {} // TODO

    return (await promiseQuery(
        'SELECT wp_posts.ID ' +
        'FROM wp_posts ' +
        `WHERE wp_posts.post_type = 'post' AND (wp_posts.post_status = 'publish') ` +
        `ORDER BY wp_posts.post_date DESC LIMIT ${params.offset}, ${params.limit};`
    )).map((item) => getString(item.ID))
}
