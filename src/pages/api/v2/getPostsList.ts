import { getTotalNumOfPosts } from '../../../servers/v2/getTotalNumOfPosts'
import { getPostsByPostIds } from '../../../servers/v2/getPostsByPostIds'
import { getPostIds } from '../../../servers/v2/getPostIds'
import { POST_LIST_TYPE } from '../../../scripts/data'

export default async (req, res) => {
    try {
        const pageNum = req.query.pageNum * 1 || 1
        const pageSize = req.query.pageSize * 1 || 10
        const type = req.query.type || POST_LIST_TYPE.GLOBAL

        const paramsForGettingTotalNumOfPosts: { [index: string]: any } = { type }

        if (type === POST_LIST_TYPE.CATEGORY) {
            paramsForGettingTotalNumOfPosts.categoryIds = req.query.categoryIds.split(',')
        }
        if (type === POST_LIST_TYPE.ARCHIVE) {
            paramsForGettingTotalNumOfPosts.year = req.query.year
            paramsForGettingTotalNumOfPosts.month = req.query.month
        }
        const totalNumOfPosts = await getTotalNumOfPosts(paramsForGettingTotalNumOfPosts)
        const totalNumOfPages = Math.ceil(totalNumOfPosts / pageSize)
        const params: {[index: string]: any} = {
            type,
            offset: (pageNum - 1) * pageSize,
            limit: pageSize,
        }
        if (type === POST_LIST_TYPE.CATEGORY) {
            params.categoryIds = paramsForGettingTotalNumOfPosts.categoryIds
        }
        if (type === POST_LIST_TYPE.ARCHIVE) {
            params.year = paramsForGettingTotalNumOfPosts.year
            params.month = paramsForGettingTotalNumOfPosts.month
        }
        const postIds = await getPostIds(params)
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
        console.log(err) // eslint-disable-line
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({
            code: '500',
            msg: err.message,
            body: null,
        }))
    }
}
