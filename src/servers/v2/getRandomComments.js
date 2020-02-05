import { promiseQuery } from '../../scripts/sql'

export const getRandomComments = async () => {
    const randomComments = (await promiseQuery(
        'SELECT c.*, p.post_title, p.post_name ' +
        'FROM wp_comments c, wp_posts p ' +
        'WHERE p.post_status = "publish" AND p.post_type = "post" AND c.comment_post_ID = p.ID ' +
        'ORDER BY RAND() LIMIT 3;'
    )).map((item) => ({ ...item }))

    return randomComments
}
