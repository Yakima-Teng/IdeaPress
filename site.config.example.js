module.exports = {
    homePage: '/blog/index', // 网站首页
    frontendRoot: '/blog', // 前台目录
    backendRoot: '/admin', // 后台目录（管理平台目录）
    serverPort: '8888', // 服务使用的端口号
    domains: {
        production: 'http://www.baidu.com', // 产线环境的域名或者ip地址（含端口）
        test: 'http://111.222.333.44', // 测试环境的域名或者ip地址（含端口）
        development: '', // 开发时连接的服务器域名或者ip地址（含端口）
    }
}
