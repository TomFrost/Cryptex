/*
 * Copyright (c) 2015-1016 TechnologyAdvice
 */

'use strict'

const fs = require('fs')

module.exports = (opts) => {
  opts = opts || {}
  const path = process.env.CRYPTEX_KEYSOURCE_FILE_PATH || opts.path
  return new Promise((resolve, reject) => {
    if (!path) {
      reject('File: Option "path" is required')
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
