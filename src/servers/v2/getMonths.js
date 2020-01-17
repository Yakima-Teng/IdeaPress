import { promiseQuery } from '../../scripts/sql'

export const getMonths = async () => {
    const months = (await promiseQuery(
        'SELECT DATE_FORMAT(post_date, "%Y") AS "year", DATE_FORMAT(post_date, "%m") AS "month", count(ID) AS numOfPosts ' +
        'FROM wp_posts ' +
        'WHERE post_status = "publish" AND post_type = "post" ' +
        'GROUP BY year, month ' +
        'ORDER BY year DESC, month DESC;'
    )).map((item) => ({ ...item }))

    return months
}
