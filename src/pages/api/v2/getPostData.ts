import { getPostDataByPostName } from '../../../servers/v2/getPostDataByPostName'
import { getSiblingsFromPosts } from '../../../servers/v2/getSiblings'
import { toDouble } from '../../../scripts/utils'

export default async (req, res) => {
    try {
        const postName = req.query.postName || ''
        const postType = req.query.postType || ''
        const returnBody: {[index: string]: any} = {}
        const post = await getPostDataByPostName({ postName, postType })

        returnBody.post = post

        const postDate = (() => {
            const objDate = post.post_date
            const yyyy = objDate.getFullYear()
            const mm = toDouble(objDate.getMonth() + 1)
            const dd = toDouble(objDate.getDate())
            const hour = toDouble(objDate.getHours())
            const min = toDouble(objDate.getMinutes())
            const second = toDouble(objDate.getSeconds())
            return `${yyyy}-${mm}-${dd} ${hour}:${min}:${second}`
        })()

        if (postType === 'post') {
            const siblings = await getSiblingsFromPosts({ postDate })
            returnBody.nextPost = siblings.nextPost
            returnBody.prevPost = siblings.prevPost
        }

        return res.json({
            code: '200',
            message: 'Success',
            body: returnBody,
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
