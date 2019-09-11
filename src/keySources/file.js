/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

const fs = require('fs')

module.exports = opts => {
  opts = opts || {}
  const path = process.env.CRYPTEX_KEYSOURCE_FILE_PATH || opts.path
  return new Promise((resolve, reject) => {
    if (!path) {
      reject(new Error('File: Option "path" is required'))
    } else {
      fs.readFile(path, (err, buf) => {
        if (err) {
          reject(err)
        } else {
          resolve(buf)
        }
      })
    }
  })
}
