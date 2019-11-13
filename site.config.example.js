module.exports = {
    seo: {
        siteMainTitle: 'IdeaPress', // 网站主标题
        siteSubTitle: 'Just another IdeaPress site', // 网站副标题
        separator: '|', // 分隔符
        keywords: ['关键词1', '关键词2'], // 关键词
        description: '网站描述', // 网站描述
        author: 'https://github.com/Yakima-Teng/IdeaPress',
        beian: '备案文案', // 备案文案
    },
    serverPort: '8888', // 服务使用的端口号
    apiPrefix: '/apis',
    proxyTable: {
        '/test/api': { target: 'http://www.baidu.com', changeOrigin: true },
    },
    blogMysql: {
        host: '123.456.789.012',
        port: 1234,
        user: 'user',
        password: 'password',
        database: 'database'
    },
}
