/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

const SymmetricAlgo = require('../lib/SymmetricAlgo')

class AES256 extends SymmetricAlgo {
  constructor() {
    let algoName = 'aes256';
    const versions = process.versions;
    if (versions.hasOwnProperty('electron') ||
      (versions.hasOwnProperty('v8') && versions.v8.toLowerCase().indexOf('electron') > -1)) {
      algoName = 'aes-256-cbc';
    }
    super(algoName, 16);
  }
}

module.exports = AES256
