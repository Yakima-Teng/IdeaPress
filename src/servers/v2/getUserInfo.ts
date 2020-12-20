import { promiseQuery } from '../../scripts/sql'

export const getUserInfo = async () => {
    const users = (await promiseQuery(
        'SELECT * ' +
        'FROM wp_users '
    )).map((item) => ({ ...item }))

    const userInfo = users.length === 0 ? null : users[0]

    return userInfo
}
