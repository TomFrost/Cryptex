/*
 * Copyright (c) 2015-1016 TechnologyAdvice
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
