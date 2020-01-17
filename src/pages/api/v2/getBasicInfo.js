import { getBlogInfo } from '../../../servers/v2/getBlogInfo'
import { getCategoryList } from '../../../servers/v2/getCategoryList'
import { getLinks } from '../../../servers/v2/getLinks'
import { getMonths } from '../../../servers/v2/getMonths'

export default async (req, res) => {
    try {
        const blogInfo = await getBlogInfo()
        const categoryList = await getCategoryList()
        const links = await getLinks()
        const months = await getMonths()

        return res.json({
            code: '200',
            message: 'Success',
            body: {
                blogInfo,
                categoryList,
                links,
                months,
            }
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
