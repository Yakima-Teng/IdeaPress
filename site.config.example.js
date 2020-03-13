module.exports = {
    seo: {
        siteMainTitle: 'IdeaPress', // 网站主标题
        siteSubTitle: 'Just another IdeaPress site', // 网站副标题
        separator: '|', // 分隔符
        keywords: ['关键词1', '关键词2'], // 关键词
        description: '网站描述', // 网站描述
        author: 'https://github.com/Yakima-Teng/IdeaPress',
        baiduStatistics: ` // 统计代码（放于script标签内的js代码片段，不含script标签部分）
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?你自己的百度统计信息";
              var s = document.getElementsByTagName("script")[0]; 
              s.parentNode.insertBefore(hm, s);
            })();
        `,
    },
    serverPort: '8888', // 服务使用的端口号
    apiPrefix: '', // api请求通用前缀，如不需要直接留空即可
    proxyTable: {
        '/wp-json': { target: 'http://www.baidu.com', changeOrigin: true },
    },
    blogMysql: {
        host: '123.456.789.012',
        port: 1234,
        user: 'user',
        password: 'password',
        database: 'database'
    },
}
