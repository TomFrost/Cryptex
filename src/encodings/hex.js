/*
 * Copyright (c) 2015-1016 TechnologyAdvice
 */

'use strict'

module.exports = (data) => {
  let hexStr = Buffer.isBuffer(data) ? data.toString() : data
  hexStr = hexStr.toLowerCase()
  return new Buffer(hexStr, 'hex')
}
