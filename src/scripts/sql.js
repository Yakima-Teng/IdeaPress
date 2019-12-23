const mysql = require('mysql')
const config = require('../../site.config')
const pool = mysql.createPool(config.blogMysql)

export const promiseQuery = (options) => new Promise((resolve, reject) => {
    const sql = typeof options === 'string' ? options : options.sql
    const params = typeof options === 'string' ? {} : (options.params || {})
    pool.getConnection((err, connection) => {
        if (err) {
            reject(err)
            return
        }
        connection.query({ sql, timeout: 40000 }, params, (err, result) => {
            connection.release()
            if (err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
})
