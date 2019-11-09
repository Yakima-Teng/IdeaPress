import M from '../../../servers/blog'

export default async (req, res) => {
    try {
        const options = {
            sortby: req.query.sortby || 'post_date',
            order: (req.query.order || 'desc').toUpperCase(), // asc, desc, rand
            offset: req.query.offset ? parseInt(req.query.offset) : 0,
            limit: req.query.limit ? parseInt(req.query.limit) : 10,
            cat: req.query.cat || ''
        }
        M.getPostExcerpts(options, (err, data) => {
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
                        post_modified_date: item.post_modified,
                        post_excerpt: item.post_excerpt || M.trimHtml(item.post_excerpt).html,
                        post_title: item.post_title,
                        post_name: item.post_name,
                        author_name: item.display_name,
                        author_id: item.post_author,
                        cat_slug: item.slug,
                        cat_name: item.name,
                        comment_count: item.comment_count,
                        comment_recent: item.recent_comment_content,
                        tags: null,
                        post_status: item.post_status,
                        comment_status: item.comment_status
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
