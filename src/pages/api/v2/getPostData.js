import { getPostDataByPostName } from '../../../servers/v2/getPostDataByPostName'

export default async (req, res) => {
    try {
        const postName = req.query.postName || ''
        const postType = req.query.postType || ''
        const post = await getPostDataByPostName({ postName, postType })

        return res.json({
            code: '200',
            message: 'Success',
            body: {
                post,
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
