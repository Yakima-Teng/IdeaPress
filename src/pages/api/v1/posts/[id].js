import M from '../../../../servers/blog'

export default async (req, res) => {
    try {
        const type = req.query.type || 'id' // `id` or `slug`
        const options = type === 'id'
            ? { postId: req.query.id }
            : { postSlug: req.query.id }
        M.getPost(options, (err, data) => {
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
                body: data.length === 0 ? null : {
                    post_id: data[0].ID,
                    post_date: data[0].post_date,
                    post_content: data[0].post_content,
                    post_title: data[0].post_title,
                    cat_slug: data[0].slug,
                    cat_name: data[0].name
                }
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
