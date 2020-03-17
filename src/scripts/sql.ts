const mysql = require('mysql')
import {
    DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_SCHEME_NAME,
} from '../site.config'

const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_SCHEME_NAME,
})

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
