import { promiseQuery } from '../../scripts/sql'

export const getBlogInfo = async () => {
    const optionNames = [
        'siteurl',
        'home',
        'blogname',
        'blogdescription',
        'users_can_register',
        'admin_email',
        'zh_cn_l10n_icp_num', // 备案号
        'posts_per_page', // 每页显示的文章数
    ]
    const options = (await promiseQuery(
        'SELECT option_name, option_value ' +
        'FROM wp_options ' +
        `WHERE wp_options.option_name IN ("${optionNames.join('", "')}") ` +
        'ORDER BY wp_options.option_id DESC;'
    )).map((item) => ({ ...item }))

    const blogInfo = optionNames.reduce((preVal, curVal) => {
        preVal[curVal] = options.find((item) => item.option_name === curVal).option_value
        return preVal
    }, {})

    return blogInfo
}
