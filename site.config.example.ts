/**
 * 网站基本信息、seo信息
 */
export const siteMainTitle: string = 'IdeaPress' // 网站主标题
export const siteSubTitle: string = 'Just another IdeaPress site' // 网站副标题
export const separator: string = '|' // 分隔符
export const keywords: string[] = ['关键词1', '关键词2'] // 关键词
export const description: string = '网站描述' // 网站描述
export const author: string = 'https://github.com/Yakima-Teng/IdeaPress'
export const baiduStatistics: string = ` // 统计代码（放于script标签内的js代码片段，不含script标签部分）
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?你自己的百度统计信息";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
`

/**
 * 服务和请求
 */
export const serverPort: string = '8888' // 服务使用的端口号
export const apiPrefix: string = '' // 统一的接口前缀，不需要时留空字符串即可
type TypeProxyTable = { [index: string]: { target: string, changeOrigin: boolean } }
export const proxyTable: TypeProxyTable = { // 转发接口映射
    '/wp-json': { target: 'http://www.baidu.com', changeOrigin: true },
}

/**
 * 数据库信息
 */
export const host: string = '123.456.789.012' // 主机名
export const port: number = 1234 // 数据库端口号，默认为3306
export const user: string = 'user' // 数据库账号的用户名
export const password: string = 'password' // 数据库账号的密码
export const database: string = 'database' // 数据库名
