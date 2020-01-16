import { promiseQuery } from '../../../scripts/sql'

export default async (req, res) => {
    try {
        const options = (await promiseQuery(
            'SELECT option_name, option_value ' +
            'FROM wp_options ' +
            `WHERE wp_options.option_name IN ('siteurl', 'home', 'blogname', 'blogdescription', 'users_can_register', 'admin_email') ` +
            'ORDER BY wp_options.option_id DESC'
        )).map((item) => ({ ...item }))

        return res.json({
            code: '200',
            message: 'Success',
            body: {
                options,
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
