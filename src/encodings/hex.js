/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

module.exports = data => {
  let hexStr = Buffer.isBuffer(data) ? data.toString() : data
  hexStr = hexStr.toLowerCase()
  return new Buffer(hexStr, 'hex')
}
