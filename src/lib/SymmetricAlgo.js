/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

const crypto = require('crypto')

const decEncoding = 'utf8'
const encEncoding = 'base64'

class SymmetricAlgo {
  constructor(algo, ivBytes) {
    this.algo = algo
    this.ivBytes = ivBytes
  }

  decrypt(key, secret) {
    const ivEnc = Buffer.isBuffer(secret)
      ? secret
      : new Buffer(secret, encEncoding)
    const iv = ivEnc.slice(0, this.ivBytes)
    const enc = ivEnc.slice(this.ivBytes)
    const decipher = crypto.createDecipheriv(this.algo, key, iv)
    const decBuf = Buffer.concat([decipher.update(enc), decipher.final()])
    return Promise.resolve(decBuf.toString(decEncoding))
  }

  encrypt(key, secret) {
    return this._generateIV().then(iv => {
      const cipher = crypto.createCipheriv(this.algo, key, iv)
      const enc = Buffer.concat([cipher.update(secret), cipher.final()])
      const ivEnc = Buffer.concat([iv, enc], iv.length + enc.length)
      return ivEnc.toString(encEncoding)
    })
  }

  _generateIV() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(this.ivBytes, (err, buf) => {
        if (err) {
          reject(err)
        } else {
          resolve(buf)
        }
      })
    })
  }
}

module.exports = SymmetricAlgo
