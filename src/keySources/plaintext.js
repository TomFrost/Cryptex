/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

module.exports = opts => {
  opts = opts || {}
  const key = process.env.CRYPTEX_KEYSOURCE_PLAINTEXT_KEY || opts.key
  if (key) {
    return Promise.resolve(key)
  }
  return Promise.reject(
    new Error('Plaintext source: Option "key" is not defined')
  )
}
