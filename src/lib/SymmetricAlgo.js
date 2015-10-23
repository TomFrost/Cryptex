/*
 * Copyright (c) 2015 TechnologyAdvice
 */

import crypto from 'crypto';

const decEncoding = 'utf8';
const encEncoding = 'base64';

export default class SymmetricAlgo {
  constructor(algo, ivBytes) {
    this.algo = algo;
    this.ivBytes = ivBytes;
  }

  decrypt(key, secret) {
    const ivEnc = Buffer.isBuffer(secret) ? secret : new Buffer(secret, encEncoding);
    const iv = ivEnc.slice(0, this.ivBytes);
    const enc = ivEnc.slice(this.ivBytes);
    const decipher = crypto.createDecipheriv(this.algo, key, iv);
    decipher.update(enc);
    return Promise.resolve(decipher.final(decEncoding));
  }

  encrypt(key, secret) {
    return this._generateIV().then((iv) =>{
      const cipher = crypto.createCipheriv(this.algo, key, iv);
      cipher.update(secret, decEncoding);
      const enc = cipher.final();
      const ivEnc = Buffer.concat([iv, enc], iv.length + enc.length);
      return ivEnc.toString(encEncoding);
    });
  }

  _generateIV() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(this.ivBytes, (err, buf) => {
        if (err) {
          reject(err);
        } else {
          resolve(buf);
        }
      });
    });
  }
}
