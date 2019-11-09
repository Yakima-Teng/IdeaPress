import M from '../../../servers/blog'

export default async (req, res) => {
    try {
        const options = {}
        M.getAllPostList(options, (err, data) => {
            if (err) {
                return res.json({
                    code: '100',
                    message: '服务器响应异常',
                    user: req.session ? req.session.userName : '',
                    body: err
                })
            }
            res.json({
                code: '200',
                message: '成功返回数据',
                user: req.session ? req.session.userName : '',
                body: data.map(item => {
                    return {
                        post_id: item.ID,
                        post_date: item.post_date,
                        post_title: item.post_title,
                        post_author_name: item.post_author,
                        comment_count: item.comment_count,
                        cat_slug: item.slug,
                        cat_name: item.name
                    }
                })
            })
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
