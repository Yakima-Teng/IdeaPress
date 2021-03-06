import { getBlogInfo } from '../../../servers/v2/getBlogInfo'
import { getCategoryList } from '../../../servers/v2/getCategoryList'
import { getLinks } from '../../../servers/v2/getLinks'
import { getMonths } from '../../../servers/v2/getMonths'
import { getRandomPosts } from '../../../servers/v2/getRandomPosts'
import { getRandomComments } from '../../../servers/v2/getRandomComments'
import { getUserInfo } from '../../../servers/v2/getUserInfo'

export default async (req, res) => {
    try {
        const blogInfo = await getBlogInfo()
        const categoryList = await getCategoryList()
        const links = await getLinks()
        const months = await getMonths()
        const randomPosts = await getRandomPosts()
        const randomComments = await getRandomComments()
        const userInfo = await getUserInfo()

        return res.json({
            code: '200',
            message: 'Success',
            body: {
                blogInfo,
                userInfo,
                categoryList,
                links,
                months,
                randomPosts,
                randomComments,
            }
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
