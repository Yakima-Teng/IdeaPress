import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'token') || ''
  if (!token) {
    event.context.auth = null
    return
  }
  if (token) {
    try {
      const jwtPayload = jwt.verify(token, useRuntimeConfig().jwtSecret)
      if (typeof jwtPayload !== 'string') {
        const userId = jwtPayload.userId
        const username = jwtPayload.username
        const role = jwtPayload.role
        event.context.auth = {
          userId,
          username,
          role,
        }
      }
    } catch (e: any) {
      event.context.auth = null
      if (e.name === 'TokenExpiredError') {
        // eslint-disable-next-line no-console
        console.log(e.message)
        return
      }
      if (e.name === 'JsonWebTokenError') {
        // eslint-disable-next-line no-console
        console.log(e.message)
        return
      }
      if (e.name === 'NotBeforeError') {
        // eslint-disable-next-line no-console
        console.log(e.message)
      }
    }
  }
})
