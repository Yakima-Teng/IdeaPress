const mysql = require('mysql')
const config = require('../../site.config')
const pool = mysql.createPool(config.blogMysql)

const async = require('async')

const md = require('markdown-it')()
const crypto = require('crypto')

import { trimHtml } from '../scripts/utils'

module.exports = class Methods {
    // get time in format like '2015-05-06 12:03:45'
    static getLocalTime (dateObj) {
        const dataTimestamp = dateObj.valueOf()
        const date = new Date(dataTimestamp)
        const year = '' + date.getFullYear()
        const month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1)
        const day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate()
        const hour = date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours()
        const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes()
        const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : '' + date.getSeconds()
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    }

    // get gmt date in format like '2015-05-06 04:03:45'
    static getGMTTime (dateObj) {
        const dataTimestamp = dateObj.valueOf() + dateObj.getTimezoneOffset() * 60 * 1000
        const date = new Date(dataTimestamp)
        const year = '' + date.getFullYear()
        const month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1)
        const day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate()
        const hour = date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours()
        const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes()
        const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : '' + date.getSeconds()
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    }

    static formatDate (date) {
        date = new Date(date)
        if (isNaN(date.valueOf())) {
            return 'Amazing Date'
        }
        const year = date.getFullYear()
        const month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1)
        const day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate()
        const hour = date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours()
        const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes()
        return [year, month, day].join('-') + ' ' + hour + ':' + minute
    }

    static markdownToHtml (markdown) {
        return md.render(markdown)
    }
    // typeOf, return 'array', 'object', 'function', 'null', 'undefined', 'string', 'number'
    static typeOf (input) {
        return ({}).toString.call(input).slice(8, -1).toLowerCase()
    }

    // 合并对象属性（在原始对象上进行修改）
    static merge (obj, options) {
        const _this = this
        if (obj && options) {
            for (let p in options) {
                if (options.hasOwnProperty(p)) {
                    if (_this.typeOf(obj[p]) === 'object' && _this.typeOf(options[p]) === 'object') {
                        _this.merge(obj[p], options[p])
                    } else {
                        obj[p] = options[p]
                    }
                }
            }
        }
        return obj
    }

    static sha1 (password) {
        const sha1 = crypto.createHash('sha1')
        return sha1.update(password).digest('hex')
    }

    static getMenus () {
        return [
            {
                menu: 'Archives',
                title: 'Archives',
                tip: '所有文章列表',
                href: '/blog/archives',
                fontAwesomeIconClass: 'fa-line-chart'
            },
            {
                menu: 'About',
                title: '关于',
                tip: '关于博主和这个站点的一些介绍',
                href: '/blog/pages/about.html',
                fontAwesomeIconClass: 'fa-gitlab'
            }
        ]
    }

    static getLinks () {
        return [
            {
                url: 'http://www.kun.la/',
                name: '马力'
            },
            {
                url: 'http://www.tipskill.com/',
                name: 'TipSkill药学博客'
            },
            {
                url: 'http://www.ruanyifeng.com/blog/',
                name: '阮一峰'
            },
            {
                url: 'http://www.orzzone.com/blog/wp-admin',
                name: '管理'
            }
        ]
    }

    static insertTagP (content) {
        // 注意，现在这个方法是有问题的，只不过暂时在页面上看起来像是正确的
        // replace newline character with html element <p></p>, \u0085代表下一行的字符，\u2028行分隔符，\u2029分段符
        content = content.replace(/\B(\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029))+\B/g, '</p><p>')
        content = content.replace(/<p>\s*?<\/p>/g, '')
        content = content.replace(/<p>\s*?<p>/g, '<p>')
        content = content.replace(/<\/p>\s+?<p>/g, '</p><p>')
        content = content.replace(/<p>\s*?<\/p>/g, '')
        content = content.replace(/(<[a-zA-Z]+>)\s*?<\/p>/g, '$1')
        content = content.replace(/<p>\s*?(<\/[^p]+>)/g, '$1')
        return content
    }

    static query (options, cb) {
        const sql = options.sql
        const params = options.params
        pool.getConnection((err, connection) => {
            if (err) {
                return cb(err, null)
            }
            connection.query({ sql, timeout: 40000 }, params, (err, result) => {
                connection.release()
                if (err) {
                    return cb(err, null)
                }
                return cb(null, result)
            })
        })
    }

    static register (options, cb) {
        const _this = this

        const userLoginName = options.userLoginName
        const userPassword = options.userPassword
        const userNiceName = options.userNiceName
        const userEmail = options.userEmail
        const userUrl = options.userUrl
        const userDisplayName = options.userDisplayName
        const userRegistered = options.userRegistered

        const queryExistence = {
            sql: 'SELECT `user_login` FROM `orzzone`.`wp_users` WHERE `user_login` = ?',
            params: [userLoginName]
        }

        const queryInsert = {
            sql: 'INSERT INTO `orzzone`.`wp_users` (`user_login`, `user_pass`, `user_nicename`, `user_email`, `user_url`, `user_registered`, `display_name`) ' +
                'VALUES (?, ?, ?, ?, ?, ?, ?)',
            params: [userLoginName, userPassword, userNiceName, userEmail, userUrl, userRegistered, userDisplayName]
        }

        async.series({
            queryExistence (callback) {
                _this.query(queryExistence, (err, result) => {
                    if (err) {
                        callback(err, null)
                    } else if (result && result.length > 0) {
                        callback(new Error('用户名已存在'), null)
                    } else {
                        callback(null, {
                            success: true,
                            result
                        })
                    }
                })
            },
            queryInsert (callback) {
                _this.query(queryInsert, (err, result) => {
                    if (err) {
                        callback(err, null)
                    } else {
                        callback(null, {
                            success: true,
                            result
                        })
                    }
                })
            }
        }, (err) => {
            if (err) {
                return cb(err, null)
            }
            return cb(null, {
                success: true,
                msg: '添加用户成功'
            })
        })
    }

    static login (options, cb) {
        const _this = this

        const userAccount = options.userAccount
        const userPassword = options.userPassword

        const queryExistence = {
            sql: 'SELECT `user_login` FROM `orzzone`.`wp_users` WHERE (`user_login` = ? OR `user_email` = ?) AND `user_pass` = ?',
            params: [userAccount, userAccount, userPassword]
        }

        _this.query(queryExistence, cb)
    }

    static getPosts (options, cb) {
        const _this = this

        const sortby = options.sortby
        const order = options.order
        const offset = options.offset
        const limit = options.limit
        const cat = options.cat

        let query
        if (limit === 0 && cat) {
            query = {
                sql: 'SELECT ID, post_date, post_date_gmt, post_content, post_title, post_name, slug, name ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE slug = ' + cat + ' AND post_status = "publish" AND post_password = "" ' +
                    (order === 'RAND' ? 'ORDER BY RAND()' : 'ORDER BY ' + sortby + ' ' + order),
                params: []
            }
        } else if (limit === 0 && !cat) {
            query = {
                sql: 'SELECT ID, post_date, post_date_gmt, post_content, post_title, post_name, slug, name ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE post_type = "post" AND post_status = "publish" AND post_password = "" ' +
                    (order === 'RAND' ? 'ORDER BY RAND()' : 'ORDER BY ' + sortby + ' ' + order),
                params: []
            }
        } else if (limit > 0 && cat) {
            query = {
                sql: 'SELECT ID, post_date, post_date_gmt, post_content, post_title, post_name, slug, name ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE slug = ? AND post_status = "publish" AND post_password = "" ' +
                    (order === 'RAND' ? 'ORDER BY RAND() LIMIT ' + offset + ', ' + limit : 'ORDER BY ' + sortby + ' ' + order + ' LIMIT ' + offset + ', ' + limit),
                params: [cat]
            }
        } else if (limit > 0 && !cat) {
            query = {
                sql: 'SELECT ID, post_date, post_date_gmt, post_content, post_title, post_name, slug, name ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE post_type = "post" AND post_status = "publish" AND post_password = "" ' +
                    (order === 'RAND' ? 'ORDER BY RAND() LIMIT ' + offset + ', ' + limit : 'ORDER BY ' + sortby + ' ' + order + ' LIMIT ' + offset + ', ' + limit),
                params: [offset, limit]
            }
        }
        _this.query(query, cb)
    }

    static getAllPostList (options, cb) {
        const _this = this
        const query = {
            sql: 'SELECT ID, post_date, post_date_gmt, post_title, post_name, post_excerpt, SUBSTRING(post_content, 1, 500) AS post_temp_excerpt, post_author, comment_count, slug, name ' +
                'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                'WHERE post_type = "post" AND post_status = "publish" AND post_password = "" ' +
                'ORDER BY post_date DESC',
            params: []
        }
        _this.query(query, cb)
    }

    static getRelatedPosts (options, cb) {
        const _this = this

        const postId = options.postId || 1
        const limit = options.limit || 10

        const query = {
            sql: 'SELECT post_title, ID ' +
                'FROM wp_posts, wp_term_relationships, wp_term_taxonomy ' +
                'WHERE wp_posts.ID = wp_term_relationships.object_id ' +
                'AND wp_term_taxonomy.taxonomy = "category" ' +
                'AND wp_term_taxonomy.term_taxonomy_id = wp_term_relationships.term_taxonomy_id ' +
                'AND wp_posts.post_status = "publish" ' +
                'AND wp_posts.post_password = "" ' +
                'AND wp_posts.post_type = "post" ' +
                'AND wp_term_taxonomy.term_id = (SELECT term_id FROM wp_terms JOIN wp_term_taxonomy USING (term_id) JOIN wp_term_relationships USING (term_taxonomy_id) WHERE object_id = ? AND taxonomy = "category") ' +
                'AND wp_posts.ID != ? ' +
                'ORDER BY RAND() ' +
                'LIMIT ?',
            params: [postId, postId, parseInt(limit)]
        }
        _this.query(query, cb)
    }

    static getPost (options, cb) {
        const _this = this

        const postId = options.postId

        const postSlug = options.postSlug

        if (postId) {
            const query = {
                sql: 'SELECT ID, post_date, post_date_gmt, post_content, post_title, slug, name ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE ID = ?',
                params: [postId]
            }
            _this.query(query, cb)
            return
        }

        if (postSlug) {
            const query = {
                sql: 'SELECT ID, post_date, post_date_gmt, post_content, post_title, slug, name, post_name ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE post_name = ?',
                params: [postSlug]
            }
            _this.query(query, cb)
        }
    }

    static getPostExcerpts (options, cb) {
        const _this = this

        const sortby = options.sortby || 'post_date'
        const order = options.order || 'DESC'
        const offset = options.offset || 0
        const limit = options.limit || 0
        const cat = options.cat || ''

        let query
        if (limit === 0 && cat) {
            query = {
                sql: 'SELECT wp_posts.ID, post_date, post_date_gmt, post_modified, display_name, post_status, comment_status, post_author, post_excerpt, SUBSTRING(post_content, 1, 500) AS post_temp_excerpt, post_title, post_name, slug, name, comment_count ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (wp_posts.ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'JOIN wp_users ON (wp_users.ID = wp_posts.post_author) ' +
                    'WHERE slug = ? AND post_status = "publish" AND post_password = "" ' +
                    (order === 'RAND' ? 'ORDER BY RAND()' : 'ORDER BY ' + sortby + ' ' + order),
                params: [cat]
            }
        } else if (limit === 0 && !cat) {
            query = {
                sql: 'SELECT wp_posts.ID, post_date, post_date_gmt, post_modified, display_name, post_status, comment_status, post_author, post_excerpt, SUBSTRING(post_content, 1, 500) AS post_temp_excerpt, post_title, post_name, slug, name, comment_count ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (wp_posts.ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'JOIN wp_users ON (wp_users.ID = wp_posts.post_author) ' +
                    'WHERE post_type = "post" AND post_status = "publish" AND post_password = "" ' +
                    (order === 'RAND' ? 'ORDER BY RAND()' : 'ORDER BY ' + sortby + ' ' + order),
                params: []
            }
        } else if (limit > 0 && cat) {
            query = {
                sql: 'SELECT wp_posts.ID, post_date, post_date_gmt, post_modified, display_name, post_status, comment_status, post_author, post_excerpt, SUBSTRING(post_content, 1, 500) AS post_temp_excerpt, post_title, post_name, slug, name, comment_count, recent_comment_content ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (wp_posts.ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'JOIN wp_users ON (wp_users.ID = wp_posts.post_author) ' +
                    'LEFT JOIN (SELECT comment_post_ID, comment_content AS recent_comment_content FROM wp_comments WHERE comment_approved = 1 ORDER BY comment_date DESC) B ON wp_posts.ID = B.comment_post_ID ' +
                    'WHERE slug = ? AND post_status = "publish" AND post_password = "" ' +
                    'GROUP BY ID ' +
                    (order === 'RAND' ? 'ORDER BY RAND() LIMIT ' + offset + ', ' + limit : 'ORDER BY ' + sortby + ' ' + order + ' LIMIT ' + offset + ', ' + limit),
                params: [cat]
            }
        } else {
            query = {
                sql: 'SELECT wp_posts.ID, post_date, post_date_gmt, post_modified, display_name, post_status, comment_status, post_author, post_excerpt, SUBSTRING(post_content, 1, 500) AS post_temp_excerpt, post_title, post_name, slug, name, comment_count, recent_comment_content ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (wp_posts.ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'JOIN wp_users ON (wp_users.ID = wp_posts.post_author) ' +
                    'LEFT JOIN (SELECT comment_post_ID, comment_content AS recent_comment_content FROM wp_comments WHERE comment_approved = 1 ORDER BY comment_date DESC) B ON wp_posts.ID = B.comment_post_ID ' +
                    'WHERE post_type = "post" AND post_status = "publish" AND post_password = "" ' +
                    'GROUP BY ID ' +
                    (order === 'RAND' ? 'ORDER BY RAND() LIMIT ' + offset + ', ' + limit : 'ORDER BY ' + sortby + ' ' + order + ' LIMIT ' + offset + ', ' + limit),
                params: []
            }
        }
        _this.query(query, cb)
    }

    // 获取月份列表，列出了各个发布了文章的月份以及该月份发布的文章数
    static getMonths (options, cb) {
        const _this = this
        const query = {
            sql: 'SELECT YEAR(post_date) AS "year", MONTH(post_date) AS "month", count(ID) as posts ' +
                'FROM wp_posts ' +
                'WHERE post_status = "publish" AND post_type = "post" ' +
                'GROUP BY YEAR(post_date), MONTH(post_date) ' +
                'ORDER BY post_date DESC',
            params: []
        }
        _this.query(query, cb)
    }

    // 获取某个月份中的文章列表
    static getPostsInMonth (options, cb) {
        const _this = this

        const year = options.year || 2016
        const month = options.month || 12
        const offset = options.offset || 0
        const limit = options.limit || 0
        const sortby = options.sortby || 'post_date'
        const order = options.order || 'DESC'

        let query

        if (limit > 0) {
            query = {
                sql: 'SELECT wp_posts.ID, post_date, post_date_gmt, post_modified, display_name, post_status, comment_status, post_author, post_excerpt, SUBSTRING(post_content, 1, 500) AS post_temp_excerpt, post_title, post_name, slug, name, comment_count, recent_comment_content ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (wp_posts.ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'JOIN wp_users ON (wp_users.ID = wp_posts.post_author) ' +
                    'LEFT JOIN (SELECT comment_post_ID, comment_content AS recent_comment_content FROM wp_comments WHERE comment_approved = 1 ORDER BY comment_date DESC) B ON wp_posts.ID = B.comment_post_ID ' +
                    'WHERE YEAR(post_date) = ? AND MONTH(post_date) = ? AND post_status = "publish" AND post_type = "post" AND post_password = "" ' +
                    'GROUP BY ID ' +
                    (order === 'RAND' ? 'ORDER BY RAND() LIMIT ' + offset + ', ' + limit : 'ORDER BY ' + sortby + ' ' + order + ' LIMIT ' + offset + ', ' + limit),
                params: [year, month]
            }
        } else {
            query = {
                sql: 'SELECT ID, post_date, post_date_gmt, post_modified, post_title, post_excerpt, SUBSTRING(post_content, 1, 500) AS post_temp_excerpt, post_name, slug, name, comment_count ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE YEAR(post_date) = ? AND MONTH(post_date) = ? AND post_status = "publish" AND post_type = "post" ' +
                    (order === 'RAND' ? 'ORDER BY RAND()' : 'ORDER BY ' + sortby + ' ' + order),
                params: [year, month]
            }
        }
        _this.query(query, cb)
    }

    static getPages (options, cb) {
        const _this = this
        const query = {
            sql: 'SELECT ID, post_name, post_date, post_date_gmt, post_excerpt, SUBSTRING(post_content, 1, 500) AS post_temp_excerpt, post_title ' +
                'FROM wp_posts ' +
                'WHERE post_type = "page" AND post_status = "publish" AND post_password = "" ' +
                'ORDER BY post_date DESC',
            params: []
        }
        _this.query(query, cb)
    }

    static getPage (options, cb) {
        const _this = this

        const postName = options.postName || ''

        const query = {
            sql: 'SELECT ID, post_name, post_date, post_date_gmt, post_content, post_title ' +
                'FROM wp_posts ' +
                'WHERE post_name = ? AND post_type = "page" AND post_status = "publish" AND post_password = "" ',
            params: [postName]
        }
        _this.query(query, cb)
    }

    static getCats (options, cb) {
        const _this = this
        const query = {
            sql: 'SELECT name, slug ' +
                'FROM wp_terms JOIN wp_term_taxonomy USING (term_id) ' +
                'WHERE taxonomy = "category" AND count <> "0" ' +
                'ORDER BY name',
            params: []
        }
        _this.query(query, cb)
    }

    static getComments (options, cb) {
        const _this = this

        const sortby = options.sortby || 'comment_date_gmt'
        const order = options.order || 'DESC'
        const offset = options.offset || 0
        const limit = options.limit || 0
        const postId = options.postId || ''

        let query
        if (postId && limit) {
            query = {
                sql: 'SELECT comment_author, comment_date, comment_author_url, comment_ID, comment_post_ID, post_title, comment_content, comment_agent, comment_parent ' +
                    'FROM wp_comments LEFT OUTER JOIN wp_posts ON (wp_comments.comment_post_ID = wp_posts.ID) ' +
                    'WHERE comment_post_ID = ? AND comment_approved = "1" AND comment_type = "" AND post_password = "" ' +
                    (order === 'RAND' ? 'ORDER BY RAND() LIMIT ' + offset + ', ' + limit : 'ORDER BY ' + sortby + ' ' + order + ' LIMIT ' + offset + ', ' + limit),
                params: [postId]
            }
        } else if (postId && !limit) {
            query = {
                sql: 'SELECT comment_author, comment_date, comment_author_url, comment_ID, comment_post_ID, post_title, comment_content, comment_agent, comment_parent ' +
                    'FROM wp_comments LEFT OUTER JOIN wp_posts ON (wp_comments.comment_post_ID = wp_posts.ID) ' +
                    'WHERE comment_post_ID = ? AND comment_approved = "1" AND comment_type = "" AND post_password = "" ' +
                    (order === 'RAND' ? 'ORDER BY RAND()' : 'ORDER BY ' + sortby + ' ' + order),
                params: [postId]
            }
        } else if (!postId && limit) {
            query = {
                sql: 'SELECT comment_author, comment_date, comment_author_url, comment_ID, comment_post_ID, post_title, comment_content, comment_agent, comment_parent ' +
                    'FROM wp_comments LEFT OUTER JOIN wp_posts ON (wp_comments.comment_post_ID = wp_posts.ID) ' +
                    'WHERE comment_approved = "1" AND comment_type = "" AND post_password = "" ' +
                    (order === 'RAND' ? 'ORDER BY RAND() LIMIT ' + offset + ', ' + limit : 'ORDER BY ' + sortby + ' ' + order + ' LIMIT ' + offset + ', ' + limit),
                params: [offset, limit]
            }
        } else if (!postId && !limit) {
            query = {
                sql: 'SELECT comment_author, comment_date, comment_author_url, comment_ID, comment_post_ID, post_title, comment_content, comment_agent, comment_parent ' +
                    'FROM wp_comments LEFT OUTER JOIN wp_posts ON (wp_comments.comment_post_ID = wp_posts.ID) ' +
                    'WHERE comment_approved = "1" AND comment_type = "" AND post_password = "" ' +
                    (order === 'RAND' ? 'ORDER BY RAND()' : 'ORDER BY ' + sortby + ' ' + order),
                params: []
            }
        }
        _this.query(query, cb)
    }

    static createComment (options, cb) {
        const _this = this

        const message = options.message
        const author = options.author
        const email = options.email
        const commentUrl = options.commentUrl
        const postId = options.postId
        const parentId = options.parentId
        const localTime = options.localTime || new Date()
        const gmtTime = options.gmtTime || new Date()
        const ip = options.ip
        const userAgent = options.userAgent

        const queryStoreComment = {
            sql: 'INSERT INTO wp_comments ' +
                '( ' +
                'comment_agent, comment_approved, comment_author, comment_author_IP, comment_author_email, comment_author_url, comment_content, comment_date, comment_date_gmt, ' +
                'comment_karma, comment_mail_notify, comment_parent, comment_post_ID, comment_type, user_id' +
                ') ' +
                'VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            params: [userAgent, '1', author, ip, email, commentUrl, message, localTime, gmtTime, '0', '0', parentId, postId, '', '0']
        }
        const queryUpdateCommentsCount = {
            sql: 'UPDATE wp_posts SET comment_count = (SELECT COUNT(*) FROM wp_comments WHERE comment_post_ID = ? AND comment_approved = ?) WHERE ID = ?',
            params: [postId, 1, postId]
        }
        async.series({
            storeComments (callback) {
                _this.query(queryStoreComment, (err, result) => {
                    if (err) {
                        callback(err, null)
                    } else {
                        callback(null, {
                            success: true,
                            result
                        })
                    }
                })
            },
            updateCommentCount (callback) {
                _this.query(queryUpdateCommentsCount, (err, result) => {
                    if (err) {
                        callback(err, null)
                    } else {
                        callback(null, {
                            success: true,
                            result
                        })
                    }
                })
            }
        }, (err) => {
            if (err) {
                cb(err, null)
            } else {
                cb(null, {
                    success: true,
                    msg: '评论提交成功'
                })
            }
        })
    }

    static searchPosts (options, cb) {
        const _this = this

        const keyword = options.keyword || ''
        const sortby = options.sortby || 'post_date'
        const order = options.order || 'DESC'
        const offset = options.offset || 0
        const limit = options.limit || 0
        const cat = options.cat

        let query
        if (!limit && cat) {
            query = {
                sql: 'SELECT ID, post_date, post_date_gmt, post_excerpt, SUBSTRING(post_content, 1, 500) AS post_temp_excerpt, post_title, slug, name, comment_count, recent_comment_content ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'LEFT JOIN (SELECT comment_post_ID, comment_content AS recent_comment_content FROM wp_comments WHERE comment_approved = 1 ORDER BY comment_date DESC) B ON ID = B.comment_post_ID ' +
                    'WHERE slug = ? AND post_status = "publish" AND post_password = "" AND post_content LIKE "%' + keyword + '%" ' +
                    'GROUP BY ID ' +
                    (order === 'RAND' ? 'ORDER BY RAND()' : 'ORDER BY ' + sortby + ' ' + order),
                params: [cat]
            }
        } else if (!limit && !cat) {
            query = {
                sql: 'SELECT ID, post_date, post_date_gmt, post_excerpt, SUBSTRING(post_content, 1, 500) AS post_temp_excerpt, post_title, slug, name, comment_count, recent_comment_content ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'LEFT JOIN (SELECT comment_post_ID, comment_content AS recent_comment_content FROM wp_comments WHERE comment_approved = 1 ORDER BY comment_date DESC) B ON ID = B.comment_post_ID ' +
                    'WHERE post_type = "post" AND post_status = "publish" AND post_password = "" AND post_content LIKE "%' + keyword + '%" ' +
                    'GROUP BY ID ' +
                    (order === 'RAND' ? 'ORDER BY RAND()' : 'ORDER BY ' + sortby + ' ' + order),
                params: []
            }
        } else if (limit && cat) {
            query = {
                sql: 'SELECT ID, post_date, post_date_gmt, post_excerpt, SUBSTRING(post_content, 1, 500) AS post_temp_excerpt, post_title, slug, name, comment_count, recent_comment_content ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'LEFT JOIN (SELECT comment_post_ID, comment_content AS recent_comment_content FROM wp_comments WHERE comment_approved = 1 ORDER BY comment_date DESC) B ON ID = B.comment_post_ID ' +
                    'WHERE slug = ? AND post_status = "publish" AND post_password = "" AND post_content LIKE "%' + keyword + '%" ' +
                    'GROUP BY ID ' +
                    (order === 'RAND' ? 'ORDER BY RAND() LIMIT ' + offset + ', ' + limit : 'ORDER BY ' + sortby + ' ' + order + ' LIMIT ' + offset + ', ' + limit),
                params: [cat, offset, limit]
            }
        } else if (limit && !cat) {
            query = {
                sql: 'SELECT ID, post_date, post_date_gmt, post_excerpt, SUBSTRING(post_content, 1, 500) AS post_temp_excerpt, post_title, slug, name, comment_count, recent_comment_content ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'LEFT JOIN (SELECT comment_post_ID, comment_content AS recent_comment_content FROM wp_comments WHERE comment_approved = 1 ORDER BY comment_date DESC) B ON ID = B.comment_post_ID ' +
                    'WHERE post_type = "post" AND post_status = "publish" AND post_password = "" AND post_content LIKE "%' + keyword + '%" ' +
                    'GROUP BY ID ' +
                    (order === 'RAND' ? 'ORDER BY RAND() LIMIT ' + offset + ', ' + limit : 'ORDER BY ' + sortby + ' ' + order + ' LIMIT ' + offset + ', ' + limit),
                params: [offset, limit]
            }
        }
        _this.query(query, cb)
    }

    static getPostSiblings (options, cb) {
        const _this = this

        const postId = options.postId
        const from = options.from || 'posts'
        const value = options.value
        const cat = options.cat || ''

        let queryPrev
        let queryNext
        if (from === 'search' && cat) {
            queryPrev = {
                sql: 'SELECT wp_posts.ID, post_title FROM wp_posts WHERE wp_posts.ID = (SELECT MAX(wp_posts.ID) ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (wp_posts.ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE wp_posts.ID < ? AND post_type = "post" AND slug = ? AND post_content LIKE "%' + value + '%" AND post_status = "publish" AND post_password = "")',
                params: [postId, cat]
            }
            queryNext = {
                sql: 'SELECT wp_posts.ID, post_title FROM wp_posts WHERE wp_posts.ID = (SELECT MIN(wp_posts.ID) ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (wp_posts.ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE wp_posts.ID > ? AND post_type = "post" AND slug = ? AND post_content LIKE "%' + value + '%" AND post_status = "publish" AND post_password = "")',
                params: [postId, cat]
            }
        } else if (from === 'search' && !cat) {
            queryPrev = {
                sql: 'SELECT ID, post_title FROM wp_posts WHERE ID = (SELECT MAX(ID) ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE ID < ? AND post_type = "post" AND post_content LIKE ? AND post_status = "publish" AND post_password = "")',
                params: [postId, `%${value}%`]
            }
            queryNext = {
                sql: 'SELECT ID, post_title FROM wp_posts WHERE ID = (SELECT MIN(ID) ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE ID < ? AND post_type = "post" AND post_content LIKE ? AND post_status = "publish" AND post_password = "")',
                params: [postId, `%${value}%`]
            }
        } else if (from === 'categories') {
            queryPrev = {
                sql: 'SELECT ID, post_title FROM wp_posts WHERE ID = (SELECT MAX(ID) ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE ID < ' + postId + ' AND post_type = "post" AND slug = "' + value + '" AND post_status = "publish" AND post_password = "")',
                params: []
            }
            queryNext = {
                sql: 'SELECT ID, post_title FROM wp_posts WHERE ID = (SELECT MIN(ID) ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE ID > ' + postId + ' AND post_type = "post" AND slug = "' + value + '" AND post_status = "publish" AND post_password = "")',
                params: []
            }
        } else if (from === 'months') {
            const year = value.split('-')[0]
            const month = value.split('-')[1]
            queryPrev = {
                sql: 'SELECT ID, post_title FROM wp_posts WHERE ID = (SELECT MAX(ID) ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE YEAR(post_date) = ? AND MONTH(post_date) = ? AND ID < ? AND post_type = "post" AND post_status = "publish" AND post_password = "")',
                params: [year, month, postId]
            }
            queryNext = {
                sql: 'SELECT ID, post_title FROM wp_posts WHERE ID = (SELECT MIN(ID) ' +
                    'FROM wp_posts JOIN wp_term_relationships ON (ID = object_id) JOIN wp_term_taxonomy USING (term_taxonomy_id) JOIN wp_terms USING (term_id) ' +
                    'WHERE YEAR(post_date) = ? AND MONTH(post_date) = ? AND ID > ? AND post_type = "post" AND post_status = "publish" AND post_password = "")',
                params: [year, month, postId]
            }
        } else if (from === 'posts') {
            queryPrev = {
                sql: 'SELECT ID, post_title FROM wp_posts WHERE ID = (SELECT MAX(ID) ' +
                    'FROM wp_posts WHERE ID < ? AND post_type = "post" AND post_status = "publish" AND post_password = "")',
                params: [postId]
            }
            queryNext = {
                sql: 'SELECT ID, post_title FROM wp_posts WHERE ID = (SELECT MIN(ID) ' +
                    'FROM wp_posts WHERE ID > ? AND post_type = "post" AND post_status = "publish" AND post_password = "")',
                params: [postId]
            }
        }

        async.parallel({
            prevPost (callback) {
                _this.query(queryPrev, (err, result) => callback(err, result))
            },
            nextPost (callback) {
                _this.query(queryNext, (err, result) => callback(err, result))
            }
        }, (err, result) => {
            cb(err, result)
        })
    }

    static getGeneralData (options, cb) {
        const _this = this
        async.parallel({
            recentComments (cb) {
                const options = {
                    sortby: 'comment_date_gmt',
                    order: 'DESC',
                    offset: 0,
                    limit: 10,
                    postId: null
                }
                _this.getComments(options, (err, data) => {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null, data.map(item => {
                            return {
                                comment_author: item.comment_author,
                                comment_date: item.comment_date,
                                comment_author_url: item.comment_author_url,
                                comment_ID: item.comment_ID,
                                comment_parent_ID: item.comment_parent,
                                comment_content: item.comment_content,
                                comment_agent: item.comment_agent,
                                post_title: item.post_title,
                                post_ID: item.comment_post_ID
                            }
                        }))
                    }
                })
            },
            pages (cb) {
                const options = {}
                _this.getPages(options, (err, data) => {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null, data.map(item => {
                            return {
                                post_id: item.ID,
                                post_name: item.post_name,
                                post_date: _this.formatDate(item.post_date),
                                post_excerpt: trimHtml(item.post_excerpt).html,
                                post_title: item.post_title
                            }
                        }))
                    }
                })
            },
            randomPosts (cb) {
                const options = {
                    sortby: 'post_date',
                    order: 'RAND',
                    offset: 0,
                    limit: 10,
                    cat: null
                }
                _this.getPostExcerpts(options, (err, data) => {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null, data.map(item => {
                            return {
                                post_id: item.ID,
                                post_date: _this.formatDate(item.post_date),
                                post_modified_date: _this.formatDate(item.post_modified),
                                post_excerpt: item.post_excerpt || trimHtml(item.post_excerpt).html,
                                post_title: item.post_title,
                                post_name: item.post_name,
                                author_name: item.display_name,
                                author_id: item.post_author,
                                cat_slug: item.slug,
                                cat_name: item.name,
                                comment_count: item.comment_count,
                                comment_recent: item.recent_comment_content,
                                tags: null,
                                post_status: item.post_status,
                                comment_status: item.comment_status
                            }
                        }))
                    }
                })
            },
            categories (cb) {
                const options = {}
                _this.getCats(options, (err, data) => {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null, data.map(item => {
                            return {
                                cat_name: item.name,
                                cat_slug: item.slug
                            }
                        }))
                    }
                })
            },
            archives (cb) {
                const options = {}
                _this.getMonths(options, (err, data) => {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null, data.map(item => {
                            return {
                                year: item.year,
                                month: item.month,
                                posts_count: item.posts
                            }
                        }))
                    }
                })
            }
        }, (err, results) => {
            if (err) {
                cb(err)
                return
            }
            results.menus = _this.getMenus()
            results.links = _this.getLinks()
            cb(null, results)
        })
    }

    // 将评论列表整理成嵌套格式
    static getLevelComments (comments) {
        let newComments = []

        // get first level comments and remove them from comments array
        for (let i = 0; i < comments.length; i++) {
            let item = comments[i]
            if (item.comment_parent_ID === 0) {
                newComments.push(item)
                comments.splice(i, 1)
                i--
            }
        }

        // set comments without corresponding parent comments as
        // first level comments and remove them from comments array
        if (comments.length > 0) {
            for (let i = 0; i < comments.length; i++) {
                let item = comments[i]
                if (
                    comments.filter(cmt => cmt.comment_ID === item.comment_parent_ID).length === 0 &&
                    newComments.filter(cmt => cmt.comment_ID === item.comment_parent_ID).length === 0
                ) {
                    newComments.push(item)
                    comments.splice(i, 1)
                    i--
                }
            }
        }

        newComments.sort(customSort)

        recursive(newComments, comments)

        return newComments

        // 处理数据时所使用的递归辅助函数，cmts为newComments中某节点的nestedComments数组
        function recursive (cmts, data) {
            if (cmts.length > 0) {
                for (let i = cmts.length - 1; i >= 0; i--) {
                    cmts[i].nestedComments = (() => {
                        let tempArr = []
                        for (let j = data.length - 1; j >= 0; j--) {
                            const item = data[j]
                            if (item.comment_parent_ID === cmts[i].comment_ID) {
                                data.splice(j, 1)
                                tempArr.push(item)
                            }
                        }
                        return tempArr
                    })().sort(customSort)
                    recursive(cmts[i].nestedComments, data)
                }
            }
        }

        function customSort (a, b) {
            return a.comment_ID - b.comment_ID
        }
    }

    static judgeBrowser (userAgent) {
        const ua = userAgent.toLowerCase()
        let version = ''
        // firefox UA demo: 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0'
        if (/firefox/.test(ua) && !/seamonkey/.test(ua)) {
            version = ua.match(/firefox\/([0-9.]+)/)[1].split('.')[0]
            return 'Firefox' + '@' + version
        }
        // Edge UA demo：'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586'
        if (ua.indexOf('edge') > -1) {
            version = ua.match(/edge\/([0-9.]+)/)[1].split('.')[0]
            return 'Edge' + '@' + version
        }
        // Opera 12-
        if (ua.indexOf('opera') > -1) {
            version = ua.match(/opera\/([0-9.]+)/)[1].split('.')[0]
            return 'Opera' + '@' + version
        }
        // Opera 15+
        if (ua.indexOf('opr') > -1) {
            version = ua.match(/opr\/([0-9.]+)/)[1].split('.')[0]
            return 'Opera' + '@' + version
        }
        // Seamonkey
        if (ua.indexOf('seamonkey') > -1) {
            version = ua.match(/seamonkey\/([0-9.]+)/)
            return 'Seamonkey' + '@' + version
        }
        // Chromium
        if (ua.indexOf('chromium') > -1) {
            version = ua.match(/chromium\/([0-9.]+)/)[1].split('.')[0]
            return 'Chromium' + '@' + version
        }
        // chrome UA demo: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
        if (ua.indexOf('chrome') > -1 && !/chromium|edge/.test(ua)) {
            version = ua.match(/chrome\/([0-9.]+)/)[1].split('.')[0]
            return 'chrome' + '@' + version
        }
        // safari
        if (ua.indexOf('safari') > -1 && !/(chrome|chromium|edge)/.test(ua)) {
            version = ua.match(/safari\/([0-9.])+/)[1].split('.')[0]
            return 'Safari' + '@' + version
        }
        // IE11
        // IE11浏览器UA示例：'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3; rv:11.0) like Gecko'
        if (/window.*trident.*rv:11\.0/.test(ua)) {
            version = ua.match(/rv:([0-9.]+)/)[1].split('.')[0]
            return 'Internet Explorer' + '@' + version
        }
        // IE6-10
        // IE10: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)'
        // IE9: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)'
        // IE8: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)'
        // IE7: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)'
        // IE6: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)'
        if (/; msie/.test(ua)) {
            version = ua.match(/msie\s([0-9.]+)/)[1].split('.')[0]
            return 'Internet Explorer' + '@' + version
        }
        // 其他情况下返回未知浏览器
        return '神奇浏览器'
    }

    static getPageNavStatistic ({ numberOfTotalRecords, curPageNum }) {
        const numberOfRecordsPerPage = 10
        const numberOfPages = Math.ceil(numberOfTotalRecords / numberOfRecordsPerPage)
        let pages = []
        // if you want to show 5 page number in the navigation bar, simply revise value of q to 5 other than 10
        const q = 10
        if (numberOfPages <= q) {
            for (let i = 0; i < numberOfPages; i++) {
                pages.push(i + 1)
            }
        } else {
            if (curPageNum <= Math.ceil(q / 2)) {
                for (let i = 0; i < q; i++) {
                    pages.push(i + 1)
                }
            } else {
                if (numberOfPages <= curPageNum + Math.ceil(q / 2 - 1)) {
                    for (let i = 0; i < q; i++) {
                        pages.push(numberOfPages - (q - 1) + i)
                    }
                } else {
                    for (let i = 0; i < q; i++) {
                        pages.push(curPageNum - Math.ceil(q / 2 - 1) + i)
                    }
                }
            }
        }
        return {
            numberOfPages,
            pages
        }
    }
}
