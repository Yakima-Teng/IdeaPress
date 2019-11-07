const os = require('os')
const domains = {
    test: domainsConfig.test, // 测试环境地址（在windows或者mac系统电脑上开发时默认连接测试环境）
    production: domainsConfig.production, // 产线环境地址
    development: domainsConfig.development, // 本地开发时连接的地址
    local: 'http://127.0.0.1:8080', // 部署到linux服务器上时使用内网地址，减少不必要的域名解析时间
}
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
    homePage: '/blog/index', // 网站首页
    frontendRoot: '/blog', // 前台目录
    backendRoot: '/admin', // 后台目录（管理平台目录）
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
    }
}
