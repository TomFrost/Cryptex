/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

const SymmetricAlgo = require('../lib/SymmetricAlgo')

class AES256 extends SymmetricAlgo {
  constructor() {
    super('aes256', 16)
  }
}

module.exports = AES256
