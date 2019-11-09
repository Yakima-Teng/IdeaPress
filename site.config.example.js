const os = require('os')
const platform = os.platform()
const isDevelopingInDeveloperComputer = platform === 'darwin' || platform === 'win32' // 是否是开发者在本地开发（当操作系统为mac或windows时，认为是在开发机上开发）

/**
 * 常用域名
 */
const domains = {
    production: 'http://www.baidu.com', // 产线环境的域名或者ip地址（含端口）
    test: 'http://111.222.333.44', // 测试环境的域名或者ip地址（含端口）
    development: 'http://111.222.333.44', // 开发时连接的服务器域名或者ip地址（含端口）
}
const apiDomainUsed = isDevelopingInDeveloperComputer ? domains.development : domains.local

module.exports = {
    seo: {
        siteMainTitle: 'IdeaPress',
        siteSubTitle: 'Just another IdeaPress site',
        keywords: ['关键词1', '关键词2'],
        description: '网站描述',
        author: 'https://github.com/Yakima-Teng/IdeaPress',
    },
    frontendRoot: '/blog', // 前台pages/frontend目录对应的url路径
    backendRoot: '/admin', // 后台pages/backend目录对应的url路径
    serverPort: '8888', // 服务使用的端口号
    apiDomainUsed,
    apiPrefix: '/apis',
    // 静态资源（不包括图片）地址前缀
    staticDomainUsed: isDevelopingInDeveloperComputer ? domains.development : '',
    staticPrefix: '/static',
    // 图片资源地址前缀
    imageDomainUsed: isDevelopingInDeveloperComputer ? domains.development : '',
    imagePrefix: '/static',
    proxyTable: {
        '/api/test': { target: apiDomainUsed, changeOrigin: true },
    },
    blogMysql: {
        host: '111.222.333.444',
        port: 1234,
        user: 'username',
        password: 'password',
        database: 'database'
    },
    facePlus: {
        apiKey: 'apiKey',
        apiSecret: 'apiSecret'
    },
    wechatProduction: {
        token: 'token',
        appid: 'appid',
        appSecret: 'appSecret'
    },
    wechat: {
        token: 'token',
        appid: 'appid',
        appSecret: 'appSecret'
    },
}
