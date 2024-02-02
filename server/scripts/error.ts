export class UnauthorizedError extends Error {
  name = 'UnauthorizedError'
  code = 401
  data: unknown = null

  constructor(message: string, data: unknown = null) {
    super(message)
    this.data = data
  }
}

export class ForbiddenError extends Error {
  name = 'ForbiddenError'
  code = 403
  data: unknown = null

  constructor(message: string, data: unknown = null) {
    super(message)
    this.data = data
  }
}

export class BusinessError extends Error {
  name = 'BusinessError'
  code = 201
  data: unknown = null

  constructor(message: string, data: unknown = null) {
    super(message)
    this.data = data
  }
}
