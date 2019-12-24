import { promiseQuery } from '../../../scripts/sql'
import {
    getString,
} from '../../../scripts/utils'

export default async (req, res) => {
    try {
        const pageNum = req.query.pageNum * 1 || 1
        const pageSize = req.query.pageSize * 1 || 10
        const totalNumOfPosts = (await promiseQuery(
            'SELECT COUNT( * ) as total ' +
            'FROM wp_posts ' +
            `WHERE wp_posts.post_type = 'post' AND (wp_posts.post_status = 'publish' OR wp_posts.post_status = 'private') `
        ))[0].total
        const totalNumOfPages = Math.ceil(totalNumOfPosts / pageSize)
        const postIds = (await promiseQuery(
            'SELECT wp_posts.ID ' +
            'FROM wp_posts ' +
            `WHERE wp_posts.post_type = 'post' AND (wp_posts.post_status = 'publish' OR wp_posts.post_status = 'private') ` +
            `ORDER BY wp_posts.post_date DESC LIMIT ${(pageNum - 1) * pageSize}, ${pageSize};`
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
        posts.forEach((post, idx) => {
            const postId = post.ID
            const relatedTaxonomies = taxonomies.filter((item) => item.object_id === postId)
            post.category = relatedTaxonomies.filter((item) => item.taxonomy === 'category')
            post.post_tag = relatedTaxonomies.filter((item) => item.taxonomy === 'post_tag')
            post.post_format = relatedTaxonomies.filter((item) => item.taxonomy === 'post_format')
        })
        return res.json({
            code: '200',
            message: 'Success',
            body: {
                curNumOfPage: pageNum,
                totalNumOfPages,
                totalNumOfPosts,
                postIds,
                posts,
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
