import Router from 'next/router'
const toTrimHtml = require('trim-html')
import {
    frontendRoot,
    backendRoot,
} from '../../site.config'

// typeOf, return 'array', 'object', 'function', 'null', 'undefined', 'string', 'number'
export const typeOf = input => ({}).toString.call(input).slice(8, -1).toLowerCase()

export const getString = (val) => val === 0 ? '0' : (val ? '' + val : '')

export const getInteger = (val) => val ? parseInt(val) : 0

// 合并对象属性（在原始对象上进行修改）
export const merge = (obj = {}, options = {}) => {
    if (typeOf(obj) === 'object' && typeOf(options) === 'object') {
        for (let p in options) {
            if (options.hasOwnProperty(p)) {
                if (typeOf(obj[p]) === 'object' && typeOf(options[p]) === 'object') {
                    merge(obj[p], options[p])
                } else {
                    obj[p] = options[p]
                }
            }
        }
    }
    return obj
}

// 求和，结果【至多】保留两位小数
export const floatAdd = (arg1, arg2) => {
    let r1
    let r2
    let m
    try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    let sum = (arg1 * m + arg2 * m) / m
    try {
        if (sum.toString().split('.')[1].length > 2) { return sum.toFixed(2) }
    } catch (e) { return sum }
    return sum
}

// 求差值，结果【至多】保留两位小数
export const floatSub = (arg1, arg2) => {
    let r1
    let r2
    let m
    let n
    try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    // 动态控制精度长度
    n = (r1 >= r2) ? r1 : r2
    if (n > 2) { n = 2 }
    return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

// 求乘积，结果【至多】保留两位小数
export const floatMul = (arg1, arg2) => {
    let m = 0
    let s1 = arg1.toString()
    let s2 = arg2.toString()
    try {
        m += s1.split('.')[1].length
    } catch (e) {
        //
    }
    try {
        m += s2.split('.')[1].length
    } catch (e) {
        //
    }
    let product = Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
    try {
        if (product.toString().split('.')[1].length > 2) { return product.toFixed(2) }
    } catch (e) { return product }
    return product
}

// 求商，结果【至多】保留两位小数
export const floatDiv = (arg1, arg2) => {
    let t1 = 0
    let t2 = 0
    let r1
    let r2
    try {
        t1 = arg1.toString().split('.')[1].length
    } catch (e) {
        //
    }
    try {
        t2 = arg2.toString().split('.')[1].length
    } catch (e) {
        //
    }
    r1 = Number(arg1.toString().replace('.', ''))
    r2 = Number(arg2.toString().replace('.', ''))
    let quotient = (r1 / r2) * Math.pow(10, t2 - t1)
    try {
        if (quotient.toString().split('.')[1].length > 2) { return quotient.toFixed(2) }
    } catch (e) { return quotient }
    return quotient
}

// 拷贝props中非函数属性
export const getDerivedStateFromProps = (props) => {
    const returnState = {}
    for (let key in props) {
        if (!props.hasOwnProperty(key)) {
            continue
        }
        if (typeof props[key] === 'function') {
            continue
        }
        returnState[key] = props[key]
    }
    return returnState
}

/**
 * validate mobile phone number
 * @param phone
 */
export const validatePhone = phone => {
    return /^1[3-8]\d{9}$/.test(phone)
}

// 全部都是空格或其他诸如tab的花，也作为无值看待
export const hasValue = val => (
    val !== '' &&
    val !== null &&
    val !== undefined &&
    !/^\s+$/.test(val)
)

export const doAlert = ({ text, callback, okCaption }) => {
    window.updateGlobalState && window.updateGlobalState({
        isAlerting: true,
        alertText: text || '',
        alertOkCallback: callback || function () {},
        alertCancelCallback: null,
        btnConfirmCaption: okCaption || '',
        btnCancelCaption: '',
    })
}

export const doConfirm = ({ text, okCallback, cancelCallback, okCaption, cancelCaption }) => {
    window.updateGlobalState && window.updateGlobalState({
        isAlerting: true,
        alertText: text || '',
        alertOkCallback: okCallback || function () {},
        alertCancelCallback: cancelCallback || function () {},
        btnConfirmCaption: okCaption || '',
        btnCancelCaption: cancelCaption || '',
    })
}

let timerForToasting = null
export const doToast = ({ text }) => {
    window.updateGlobalState && window.updateGlobalState({
        isToasting: true,
        toastingText: text,
    })
    if (timerForToasting) {
        clearTimeout(timerForToasting)
    }
    timerForToasting = setTimeout(() => {
        window.updateGlobalState && window.updateGlobalState({
            isToasting: false,
            toastingText: '',
        })
    }, 3000)
}

export const doLoad = (bool) => {
    if (bool) {
        window.updateGlobalState && window.updateGlobalState({
            isLoading: true,
        })
        return
    }
    window.updateGlobalState && window.updateGlobalState({
        isLoading: false,
    })
}

// 将一位数（数字或字符串）转化成两位数（字符串）
export const toDouble = num => {
    num = parseInt(num)
    return num < 10 ? ('' + 0 + num) : num
}

// 将Date对象的实例转换成"yyyy-mm-dd"格式的字符串
const dateToString = (date = new Date()) => {
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    return `${y}-${toDouble(m)}-${toDouble(d)}`
}

// 将时间戳转换为形如"2016-12-15"的字符串
export const timestampToString = timestamp => {
    return dateToString(new Date(timestamp))
}

// 以当前日期为参考日期计算指定年月日偏差后的日期，输出格式为"yyyy-mm-dd"
export const getRelativeDateStr = (yDiff = 0, mDiff = 0, dDiff = 0) => {
    const date = new Date()
    date.setFullYear(date.getFullYear() + yDiff)
    date.setMonth(date.getMonth() + mDiff)
    date.setDate(date.getDate() + dDiff)
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    return `${y}-${toDouble(m)}-${toDouble(d)}`
}

const goPage = (opts, projectRoot) => {
    let pathname = typeof opts === 'string' ? opts : (opts.pathname || '')
    const query = typeof opts === 'string' ? {} : (opts.query || {})
    const reg = new RegExp(`^${projectRoot}`)
    if (!reg.test(pathname)) {
        pathname = projectRoot + (pathname || '')
    }
    Router.push({
        pathname: pathname || '',
        query: query || {},
    }).then(() => {
        window.scrollTo(0, 0)
    })
}

const replacePage = (opts, projectRoot) => {
    let pathname = typeof opts === 'string' ? opts : (opts.pathname || '')
    const query = typeof opts === 'string' ? {} : (opts.query || {})
    const reg = new RegExp(`^${projectRoot}`)
    if (!reg.test(pathname)) {
        pathname = projectRoot + (pathname || '')
    }
    Router.replace({
        pathname: pathname || '',
        query: query || {},
    }).then(() => {
        window.scrollTo(0, 0)
    })
}

export const goFrontendPage = (opts) => goPage(opts, '/blog')
export const replaceFrontendPage = (opts) => replacePage(opts, '/blog')

export const goBackendPage = (opts) => goPage(opts, '/admin')
export const replaceBackendPage = (opts) => replacePage(opts, '/admin')

export const refreshPage = (opts = {}) => {
    replacePage({
        pathname: Router.pathname,
        query: {
            ...Router.query,
            ...opts,
            ts: +new Date(),
        },
    })
}

export const getTimeLeft = () => {
    const nowDate = new Date()
    const year = nowDate.getFullYear()
    const month = nowDate.getMonth()
    const date = nowDate.getDate()
    const hour = nowDate.getHours()
    const minute = nowDate.getMinutes()
    const second = nowDate.getSeconds()
    const day = nowDate.getDay()

    const getTimeLeftString = (targetDate) => {
        let ts = +targetDate - nowDate.getTime()
        const d = Math.floor(ts / (24 * 60 * 60 * 1000))
        ts -= d * 24 * 60 * 60 * 1000
        const h = Math.floor(ts / (60 * 60 * 1000))
        ts -= h * 60 * 60 * 1000
        const m = Math.floor(ts / (60 * 1000))
        ts -= m * 60 * 1000
        const s = Math.floor(ts / 1000)
        return `${d}天${h}时${m}分${s}秒`
    }
    const timeLeftThisWeek = getTimeLeftString(new Date(
        +new Date(year, month, date + 1, 0, 0, 0) +
        (day === 0 ? 0 : (7 - day) * 24 * 60 * 60 * 1000)
    ))
    const timeLeftThisMonth = getTimeLeftString(new Date(year, month + 1, 1, 0, 0, 0))
    const timeLeftThisYear = getTimeLeftString(new Date(year + 1, 0, 1, 0, 0, 0))
    return {
        dateStr: `${year}年${month + 1}月${date}日 ${hour}:${minute}:${second}`,
        dayStr: `星期${['日', '一', '二', '三', '四', '五', '六'][day]}`,
        timeLeftThisWeek,
        timeLeftThisMonth,
        timeLeftThisYear,
    }
}

// 去除html字符串中的标签，以获取纯文本内容
export const trimHtml = (htmlContent) => {
    return toTrimHtml(htmlContent, {
        limit: 150,
        suffix: '...',
        preserveTags: false
    })
}

// a helper function used to transfer object like { a: 1, b: 2 } to string like 'a=1&b=2'
export const transferQueryObjectToString = (queryObject = {}) => {
    let tempArray = []
    for (let key in queryObject) {
        if (queryObject.hasOwnProperty(key)) {
            const value = queryObject[key]
            tempArray.push(`${key}=${value}`)
        }
    }
    return tempArray.join('&')
}
