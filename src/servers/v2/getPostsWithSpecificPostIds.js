import { promiseQuery } from '../../scripts/sql'

export const getPostsWithSpecificPostIds = async ({ postIds }) => {
    const posts = (await promiseQuery(
        'SELECT wp_posts.* ' +
        'FROM wp_posts ' +
        `WHERE ID IN (${postIds.join(',')}) ` +
        'ORDER BY wp_posts.post_date DESC;'
    )).map((item) => ({ ...item }))

    const taxonomies = (await promiseQuery(
        'SELECT  t.*, tt.*, tr.object_id ' +
        'FROM wp_terms AS t ' +
        'INNER JOIN wp_term_taxonomy AS tt ON t.term_id = tt.term_id ' +
        'INNER JOIN wp_term_relationships AS tr ON tr.term_taxonomy_id = tt.term_taxonomy_id ' +
        `WHERE tt.taxonomy IN ('category', 'post_tag', 'post_format') AND tr.object_id IN (${postIds.join(',')}) ` +
        'ORDER BY t.name ASC;'
    )).map((item) => ({ ...item }))

    posts.forEach((post, idx) => {
        const postId = post.ID
        const relatedTaxonomies = taxonomies.filter((item) => item.object_id === postId)
        post.category = relatedTaxonomies.filter((item) => item.taxonomy === 'category')
        post.post_tag = relatedTaxonomies.filter((item) => item.taxonomy === 'post_tag')
        post.post_format = relatedTaxonomies.filter((item) => item.taxonomy === 'post_format')
    })

    return posts
}
