import { promiseQuery } from '../../scripts/sql'

export const getSiblingsFromPosts = async ({ postDate }) => { // postDate格式为：2018-10-07 12:28:54
    const prevPost = (await promiseQuery(
        'SELECT p.ID, p.post_title, p.post_name ' +
        'FROM wp_posts AS p ' +
        `WHERE p.post_date < '${postDate}' ` +
        'AND p.post_type = \'post\' ' +
        'AND p.post_status = \'publish\' ' +
        'ORDER BY p.post_date DESC LIMIT 1;'
    )).map((item) => ({ ...item }))[0]

    const nextPost = (await promiseQuery(
        'SELECT p.ID, p.post_title, p.post_name ' +
        'FROM wp_posts AS p ' +
        `WHERE p.post_date > '${postDate}' ` +
        'AND p.post_type = \'post\' ' +
        'AND p.post_status = \'publish\' ' +
        'ORDER BY p.post_date ASC LIMIT 1;'
    )).map((item) => ({ ...item }))[0]

    return {
        prevPost,
        nextPost,
    }
}
