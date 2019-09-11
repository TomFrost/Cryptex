/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

module.exports = data => {
  const base64Str = Buffer.isBuffer(data) ? data.toString() : data
  return new Buffer(base64Str, 'base64')
}
