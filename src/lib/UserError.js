/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

class UserError extends Error {
  constructor(message, fileName, lineNumber) {
    super(message, fileName, lineNumber)
    this.message = message
    this.fileName = fileName
    this.lineNumber = lineNumber
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = UserError
