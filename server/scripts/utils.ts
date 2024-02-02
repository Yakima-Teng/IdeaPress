import CryptoJS from 'crypto-js'

// AES加解密用的key
const aesKey = useRuntimeConfig().aesKey

// AES加密
export const encrypt = (word: string): string => {
  const key = CryptoJS.enc.Utf8.parse(aesKey)
  const encrypted = CryptoJS.AES.encrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

// AES解密
export const decrypt = (word: string): string => {
  const key = CryptoJS.enc.Utf8.parse(aesKey)
  const decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

const letters = 'abcdefghijklmnopqrstuvwxyz'
const getRandomLetters = (numOfLetters: number): string => {
  let returnStr = ''
  for (let i = 0; i < numOfLetters; i++) {
    returnStr += letters[Math.floor(Math.random() * 26)]
  }
  return returnStr
}

// 在密码中掺入假字符串
export const saltPassword = (password: string): string => {
  return `${password.substring(0, 4)}${getRandomLetters(4)}${password.substring(
    4
  )}`
}

// 判断密码是否正确
export const checkPasswordEquality = (dataPassword: string, encryptedPassword: string): boolean => {
  // 去掉旧密码中掺入的假字符串
  const realPassword = `${dataPassword.substring(
    0,
    4
  )}${dataPassword.substring(8)}`
  return realPassword === encryptedPassword
}

// 解析浏览器userAgent，获取操作系统
export const parseOSFromUserAgent = (userAgent: string): string => {
  if (userAgent.indexOf('Windows NT 10.0') !== -1) return 'Windows 10'
  if (userAgent.indexOf('Windows NT 6.2') !== -1) return 'Windows 8'
  if (userAgent.indexOf('Windows NT 6.1') !== -1) return 'Windows 7'
  if (userAgent.indexOf('Windows NT 6.0') !== -1) return 'Windows Vista'
  if (userAgent.indexOf('Windows NT 5.1') !== -1) return 'Windows XP'
  if (userAgent.indexOf('Windows NT 5.0') !== -1) return 'Windows 2000'
  if (userAgent.indexOf('Mac') !== -1) return 'Mac/iOS'
  if (userAgent.indexOf('X11') !== -1) return 'UNIX'
  if (userAgent.indexOf('Linux') !== -1) return 'Linux'
  return 'Other'
}

// 解析浏览器userAgent，获取浏览器信息
export const parseBrowserFromUserAgent = (userAgent: string): string => {
  const ua = userAgent.toLocaleLowerCase()
  if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
    return 'IE'
  }
  if (ua.match(/firefox/) != null) {
    return 'Firefox'
  }
  if (ua.match(/ucbrowser/) != null) {
    return 'UC'
  }
  if (ua.match(/opera/) != null || ua.match(/opr/) != null) {
    return 'Opera'
  }
  if (ua.match(/bidubrowser/) != null) {
    return 'Baidu'
  }
  if (ua.match(/metasr/) != null) {
    return 'Sougou'
  }
  if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
    return 'QQ'
  }
  if (ua.match(/maxthon/) != null) {
    return 'Maxthon'
  }
  if (ua.match(/chrome/) != null) {
    if (ua.match(/wow64/) != null) {
      return '360'
    }
    return 'Chrome'
  }
  if (ua.match(/safari/) != null) {
    return 'Safari'
  }
  return 'Other'
}

// 业务成功响应
export const replySuccess = (message: string, data?: unknown) => {
  return {
    code: 200,
    data: data || null,
    message: message || 'success',
  }
}

// 业务失败响应
export const replyFailure = (message: string, data?: unknown) => {
  return {
    code: 201,
    data: data || null,
    message,
  }
}
