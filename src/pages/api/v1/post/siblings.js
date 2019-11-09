import M from '../../../../servers/blog'

export default async (req, res) => {
    try {
        const options = {
            postId: req.query.postId || 0,
            from: req.query.from || '',
            value: req.query.value || '',
            cat: req.query.cat || ''
        }
        M.getPostSiblings(options, (err, data) => {
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
                body: {
                    prev: {
                        post_id: data.prevPost.length > 0 ? data.prevPost[0].ID : '',
                        post_title: data.prevPost.length > 0 ? data.prevPost[0].post_title : ''
                    },
                    next: {
                        post_id: data.nextPost.length > 0 ? data.nextPost[0].ID : '',
                        post_title: data.nextPost.length > 0 ? data.nextPost[0].post_title : ''
                    }
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
