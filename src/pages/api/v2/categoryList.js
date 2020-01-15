import { promiseQuery } from '../../../scripts/sql'

export default async (req, res) => {
    try {
        const categoryList = (await promiseQuery(
            'SELECT t.*, tt.* ' +
            'FROM wp_terms AS t ' +
            'INNER JOIN wp_term_taxonomy AS tt ON t.term_id = tt.term_id ' +
            'WHERE tt.taxonomy IN (\'category\') ' +
            'ORDER BY t.name ASC'
        )).map((item) => ({ ...item }))

        return res.json({
            code: '200',
            message: 'Success',
            body: {
                categoryList,
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
