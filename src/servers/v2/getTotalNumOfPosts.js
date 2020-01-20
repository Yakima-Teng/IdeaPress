import { promiseQuery } from '../../scripts/sql'

export const getTotalNumOfPosts = async (params) => {
    params.type = params.type || 'post'

    if (params.type === 'category') {} // TODO:

    if (params.type === 'archive') {} // TODO:

    return (await promiseQuery(
        'SELECT COUNT( * ) as total ' +
        'FROM wp_posts ' +
        `WHERE wp_posts.post_type = 'post' AND (wp_posts.post_status = 'publish');`
    ))[0].total
}
