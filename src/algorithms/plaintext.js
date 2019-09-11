/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

class Plaintext {
  decrypt(key, secret) {
    return secret.toString()
  }

  encrypt(key, secret) {
    return secret.toString()
  }
}

module.exports = Plaintext
