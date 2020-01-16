import { promiseQuery } from '../../../scripts/sql'

export default async (req, res) => {
    try {
        const months = (await promiseQuery(
            'SELECT DATE_FORMAT(post_date, "%Y") AS "year", DATE_FORMAT(post_date, "%m") AS "month", count(ID) AS numOfPosts ' +
            'FROM wp_posts ' +
            'WHERE post_status = "publish" AND post_type = "post" ' +
            'GROUP BY year, month ' +
            'ORDER BY year DESC, month DESC;'
        )).map((item) => ({ ...item }))

        return res.json({
            code: '200',
            message: 'Success',
            body: {
                months,
            },
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
