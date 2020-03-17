import { promiseQuery } from '../../scripts/sql'

export const getLinks = async () => {
    const links = (await promiseQuery(
        'SELECT * ' +
        'FROM wp_links ' +
        'WHERE wp_links.link_visible = \'Y\' ' +
        'ORDER BY wp_links.link_rating DESC;'
    )).map((item) => ({ ...item }))

    return links
}
