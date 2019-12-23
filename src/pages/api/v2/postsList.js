import { promiseQuery } from '../../../scripts/sql'
import {
    getString,
    trimHtml,
} from '../../../scripts/utils'
import { numOfPostsPerPage } from '../../../scripts/data'

export default async (req, res) => {
    try {
        const totalNumOfPosts = (await promiseQuery(
            'SELECT COUNT( * ) as total ' +
            'FROM wp_posts ' +
            `WHERE wp_posts.post_type = 'post' AND (wp_posts.post_status = 'publish' OR wp_posts.post_status = 'private') `
        ))[0].total
        const curNumOfPage = 1
        const totalNumOfPages = Math.ceil(totalNumOfPosts / numOfPostsPerPage)
        const postIds = (await promiseQuery(
            'SELECT wp_posts.ID ' +
            'FROM wp_posts ' +
            `WHERE wp_posts.post_type = 'post' AND (wp_posts.post_status = 'publish' OR wp_posts.post_status = 'private') ` +
            'ORDER BY wp_posts.post_date DESC LIMIT 0, 10;'
        )).map((item) => getString(item.ID))
        const posts = (await promiseQuery(
            'SELECT wp_posts.* ' +
            'FROM wp_posts ' +
            `WHERE ID IN (${postIds.join(',')}) ` +
            'ORDER BY wp_posts.post_date DESC'
        )).map((item) => ({ ...item }))
        const taxonomies = (await promiseQuery(
            'SELECT  t.*, tt.*, tr.object_id ' +
            'FROM wp_terms AS t ' +
            'INNER JOIN wp_term_taxonomy AS tt ON t.term_id = tt.term_id ' +
            'INNER JOIN wp_term_relationships AS tr ON tr.term_taxonomy_id = tt.term_taxonomy_id ' +
            `WHERE tt.taxonomy IN ('category', 'post_tag', 'post_format') AND tr.object_id IN (${postIds.join(',')}) ` +
            'ORDER BY t.name ASC'
        )).map((item) => ({ ...item }))
        const postMetas = (await promiseQuery(
            'SELECT post_id, meta_key, meta_value ' +
            'FROM wp_postmeta ' +
            `WHERE post_id IN (${postIds.join(',')}) ORDER BY meta_id ASC`
        )).map((item) => ({ ...item }))
        return res.json({
            code: '200',
            message: 'Success',
            body: {
                curNumOfPage,
                totalNumOfPages,
                totalNumOfPosts,
                postIds,
                posts,
                taxonomies,
                postMetas,
            },
        })
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({
            code: '500',
            msg: err.message,
            body: null,
        }))
    }
}
