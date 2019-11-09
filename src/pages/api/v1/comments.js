import M from '../../../servers/blog'

export default async (req, res) => {
    try {
        const options = {
            sortby: req.query.sortby || 'comment_date_gmt',
            order: (req.query.order || 'desc').toUpperCase(),
            offset: req.query.offset ? parseInt(req.query.offset) : 0,
            limit: req.query.limit ? parseInt(req.query.limit) : 10,
            postId: req.query.postId || ''
        }
        M.getComments(options, (err, data) => {
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
                        comment_author: item.comment_author,
                        comment_date: item.comment_date,
                        comment_author_url: item.comment_author_url,
                        comment_ID: item.comment_ID,
                        comment_parent_ID: item.comment_parent,
                        comment_content: item.comment_content,
                        comment_agent: item.comment_agent,
                        post_title: item.post_title,
                        post_ID: item.comment_post_ID
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
