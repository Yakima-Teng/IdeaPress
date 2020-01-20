import { getTotalNumOfPosts } from '../../../servers/v2/getTotalNumOfPosts'
import { getPostsByPostIds } from '../../../servers/v2/getPostsByPostIds'
import { getPostIds } from '../../../servers/v2/getPostIds'

export default async (req, res) => {
    try {
        const pageNum = req.query.pageNum * 1 || 1
        const pageSize = req.query.pageSize * 1 || 10
        const totalNumOfPosts = await getTotalNumOfPosts({ type: 'post' })
        const totalNumOfPages = Math.ceil(totalNumOfPosts / pageSize)
        const postIds = await getPostIds({
            type: 'post',
            offset: (pageNum - 1) * pageSize,
            limit: pageSize,
        })
        const posts = await getPostsByPostIds({ postIds })

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
