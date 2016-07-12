/*
 * Copyright (c) 2015-1016 TechnologyAdvice
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
