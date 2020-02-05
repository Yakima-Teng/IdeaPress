import { promiseQuery } from '../../scripts/sql'
import { getCatsTagsAndFormatsByPostIds } from './getCatsTagsAndFormatsByPostIds'

export const getRandomPosts = async () => {
    const posts = (await promiseQuery(
        'SELECT wp_posts.* ' +
        'FROM wp_posts ' +
        'WHERE post_status = "publish" AND post_type = "post" ' +
        'ORDER BY RAND() LIMIT 8;'
    )).map((item) => ({ ...item }))

    const taxonomies = await getCatsTagsAndFormatsByPostIds({ postIds: posts.map((item) => item.ID) })

    posts.forEach((post) => {
        const postId = post.ID
        const relatedTaxonomies = taxonomies.filter((item) => item.object_id === postId)
        post.category = relatedTaxonomies.filter((item) => item.taxonomy === 'category')
        post.post_tag = relatedTaxonomies.filter((item) => item.taxonomy === 'post_tag')
        post.post_format = relatedTaxonomies.filter((item) => item.taxonomy === 'post_format')
    })

    return posts
}
