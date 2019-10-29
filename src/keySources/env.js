/*
 * Copyright (c) 2017 Tom Shawver
 */

'use strict'

module.exports = () => {
  return new Promise((resolve, reject) => {
    if (process.env.CRYPTEX_ENV_KEY) {
      resolve(process.env.CRYPTEX_ENV_KEY)
    } else {
      reject(new Error('CRYPTEX_ENV_KEY not assigned'))
    }
  })
}
