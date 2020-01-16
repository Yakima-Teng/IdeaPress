import { promiseQuery } from '../../../scripts/sql'

export default async (req, res) => {
    try {
        const links = (await promiseQuery(
            'SELECT * ' +
            'FROM wp_links ' +
            `WHERE wp_links.link_visible = 'Y' ` +
            'ORDER BY wp_links.link_rating DESC;'
        )).map((item) => ({ ...item }))

        return res.json({
            code: '200',
            message: 'Success',
            body: {
                links,
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
