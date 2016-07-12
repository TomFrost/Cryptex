/*
 * Copyright (c) 2015-1016 TechnologyAdvice
 */

'use strict'

module.exports = (data) => {
  const base64Str = Buffer.isBuffer(data) ? data.toString() : data
  return new Buffer(base64Str, 'base64')
}
