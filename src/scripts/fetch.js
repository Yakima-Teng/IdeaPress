import fetch from 'isomorphic-fetch'
import hexMd5 from 'md5-hex'
import qs from 'qs'
import { doLoad } from './utils'
import {
    apiDomainUsed,
    apiPrefix,
} from '../../site.config'

let ajaxCounter = 0
const doAjaxLoad = (bool) => {
    if (bool === true) {
        ajaxCounter++
    } else {
        ajaxCounter--
    }
    if (ajaxCounter === 1) {
        doLoad(true)
    }
    if (ajaxCounter <= 0) {
        doLoad(false)
    }
}

export const doPost = (targetUrl, data, options = {}) => {
    const useRawData = 'useRawData' in options
    if (useRawData === true) {
        delete options.useRawData
    }
    if (typeof window !== 'undefined') {
        if (options.hideLoading !== true) {
            doAjaxLoad(true)
        }
    }
    if (!/^http/.test(targetUrl)) {
        targetUrl = (typeof window === 'undefined' ? 'http://localhost:3000' : '') + (apiDomainUsed + apiPrefix) + targetUrl
    }

    // 对password字段进行加密处理
    if (useRawData === false && ('password' in data)) {
        data.password = hexMd5(data.password)
    }

    // console.log()
    // console.log(`url: ${targetUrl}，request: ${JSON.stringify(requestData)}`)

    return new Promise((resolve, reject) => {
        fetch(targetUrl, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                ...(() => {
                    if (typeof FormData !== 'undefined' && data instanceof FormData) {
                        return {}
                    }
                    return { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
                })(),
                ...options,
            },
            body: (() => {
                if (typeof FormData !== 'undefined' && data instanceof FormData) {
                    return data
                }
                if (useRawData === true) {
                    return qs.stringify(data)
                }
                const requestData = (() => {
                    const d = new Date().getTime()
                    return {
                        requestTime: d,
                        sessionToken: hexMd5((d + '').substring((d + '').length - 8)),
                        requestBody: JSON.stringify({
                            h5: {
                                platform: 'pc',
                                ua: typeof window === 'undefined' ? 'node' : navigator.userAgent,
                            },
                            ...data,
                        }),
                    }
                })()
                return qs.stringify(requestData)
            })(),
        }).then(async (res) => {
            if (typeof window !== 'undefined') {
                if (options.hideLoading !== true){
                    doAjaxLoad(false)
                }
            }
            const response = await res.json()

            // console.log(`url: ${targetUrl}，response: ${JSON.stringify(response)}`)

            if (
                response.status === '200' ||
                (!('status' in response) && 'success' in response) // 后台系统的登录接口不符合前台数据响应格式
            ) {
                resolve(response)
                return
            }
            reject(new Error('Server Error with non-200 status'))
        }).catch((err) => {
            if (typeof window !== 'undefined') {
                doAjaxLoad(false)
            }
            reject(err)
        })
    })
}
