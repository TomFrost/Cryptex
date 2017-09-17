/*
 * Copyright (c) 2017 Tom Shawver
 */

'use strict'

const _ = require('lodash')
const path = require('path')
const UserError = require('./lib/UserError')

const defaultFilename = 'cryptex.json'
const defaultEnv = 'default'

class Cryptex {

  /**
   * Constructs a new instance of Cryptex.
   * @param {Object} [opts={}] An options object
   * @param {string} [opts.file] The config file to load, containing environment names mapped to config objects. If not
   *    specified, Cryptex will look for a "cryptex.json" file in the process's current working directory. Can be
   *    overridden with the `CRYPTEX_FILE` env var.
   * @param {string} [opts.env] The environment key to use in the config file. If not specified, `$NODE_ENV` and
   *    `default` are tried, in that order. Can be overridden with the `CRYPTEX_ENV` env var.
   * @param {boolean} [opts.cacheKey=true] If true, the key provided by the keySource will be cached in memory for
   *    a specified period of time. Set to false for highest security, the possible expense of performance. Can be
   *    overridden with the `CRYPTEX_CACHEKEY` env var (set to "true", or anything else for false).
   * @param {number} [opts.cacheTimeout=5000] The amount of time, in milliseconds, to cache the key provided by the
   *    keySource. If 0, the cache will never be cleared automatically. Has no effect unless `opts.cacheKey` is true.
   *    Can be overridden with the `CRYPTEX_CACHETIMEOUT` env var.
   * @param {Object} [opts.config] A configuration object specifying the key source, encryption algorithm, and
   *    optionally encrypted keys to initialize Crypto with. If specified, no file load will be attempted. To prevent
   *    a file load without specifying a config, pass an empty object here.
   */
  constructor(opts) {
    opts = opts || {}
    this._opts = {
      file: process.env.CRYPTEX_FILE || path.join(process.cwd(), defaultFilename),
      env: process.env.CRYPTEX_ENV || process.env.NODE_ENV || defaultEnv,
      cacheKey: process.env.CRYPTEX_CACHEKEY ? process.env.CRYPTEX_CACHEKEY === 'true' : true,
      cacheTimeout: process.env.CRYPTEX_CACHETIMEOUT ? parseInt(process.env.CRYPTEX_CACHETIMEOUT, 10) : 5000
    }
    this.update(opts)
  }

  decrypt(data, encoding) {
    encoding = encoding || 'base64'
    const enc = Cryptex._bufferize(data, encoding)
    return Promise.resolve().then(() => {
      return this._getKey()
    }).then((key) => {
      return this._getAlgo().decrypt(key, enc)
    })
  }

  encrypt(data, encoding) {
    encoding = encoding || 'utf8'
    const dec = Cryptex._bufferize(data, encoding)
    return Promise.resolve().then(() => {
      return this._getKey()
    }).then((key) => {
      return this._getAlgo().encrypt(key, dec)
    })
  }

  getSecret(secret, optional) {
    const secretUp = secret.toUpperCase()
    const enc = process.env[`CRYPTEX_SECRET_${secretUp}`] || this._config.secrets[secret]
    if (!enc) {
      return optional ? Promise.resolve(null) :
        Promise.reject(new UserError(`Secret "${secret}" not found`))
    }
    return this.decrypt(enc, this._config.secretEncoding)
  }

  getSecrets(secrets, optional) {
    const vals = {}
    let promiseChain = Promise.resolve()
    let prev
    secrets.forEach((secret) => {
      let key = prev
      prev = secret
      promiseChain = promiseChain.then((val) => {
        if (key) {
          vals[key] = val
        }
        return this.getSecret(secret, optional)
      })
    })
    return promiseChain.then((val) => {
      vals[prev] = val
      return vals
    })
  }

  /**
   * Updates this Cryptex instance with new configuration. Note that this will cause this instance to clear all
   * caches, reload any configuration files, and apply any changes to environment variables since it was last
   * initialized.
   * @param {Object} [opts={}] An options object
   * @param {string} [opts.file] The config file to load, containing environment names mapped to config objects. If not
   *    specified, Cryptex will look for a "cryptex.json" file in the process's current working directory. Can be
   *    overridden with the `CRYPTEX_FILE` env var.
   * @param {string} [opts.env] The environment key to use in the config file. If not specified, `$NODE_ENV` and
   *    `default` are tried, in that order. Can be overridden with the `CRYPTEX_ENV` env var.
   * @param {boolean} [opts.cacheKey=true] If true, the key provided by the keySource will be cached in memory for
   *    a specified period of time. Set to false for highest security, the possible expense of performance. Can be
   *    overridden with the `CRYPTEX_CACHEKEY` env var (set to "true", or anything else for false).
   * @param {number} [opts.cacheTimeout=5000] The amount of time, in milliseconds, to cache the key provided by the
   *    keySource. If 0, the cache will never be cleared automatically. Has no effect unless `opts.cacheKey` is true.
   *    Can be overridden with the `CRYPTEX_CACHETIMEOUT` env var.
   * @param {Object} [opts.config] A configuration object specifying the key source, encryption algorithm, and
   *    optionally encrypted keys to initialize Crypto with. If specified, no file load will be attempted. To prevent
   *    a file load without specifying a config, pass an empty object here.
   */
  update(opts) {
    _.assign(this._opts, opts || {})
    if (this._opts.config) {
      this._config = this._opts.config
    } else {
      this._config = this._loadEnvFromFile()
    }
    this._config.secrets = this._config.secrets || {}
    this._config.secretEncoding = process.env.CRYPTEX_SECRETENCODING || this._config.secretEncoding || 'base64'
    this._config.algorithm = process.env.CRYPTEX_ALGORITHM || this._config.algorithm || 'aes256'
    this._config.keySource = process.env.CRYPTEX_KEYSOURCE || this._config.keySource
    this._config.keySourceEncoding = process.env.CRYPTEX_KEYSOURCEENCODING || this._config.keySourceEncoding ||
      'binary'
    delete this._key
    delete this._algoInst
  }

  _getAlgo() {
    if (!this._algoInst) {
      const AlgoClass = Cryptex._require('algorithms', this._config.algorithm)
      this._algoInst = new AlgoClass(this._config.algorithmOpts)
    }
    return this._algoInst
  }

  _getKey() {
    if (this._key) {
      return Promise.resolve(this._key)
    }
    if (!this._config.keySource) {
      return Promise.reject(new UserError('KeySource not found. Is Cryptex properly configured?'))
    }
    const sourceGetKey = Cryptex._require('keySources', this._config.keySource)
    const toBuffer = Cryptex._require('encodings', this._config.keySourceEncoding)
    return sourceGetKey(this._config.keySourceOpts).then((keyData) => {
      if (keyData && !Buffer.isBuffer(keyData) && this._config.keySourceEncoding === 'binary') {
        throw new UserError("Please specify a key encoding. Looks like it's not a binary buffer!")
      }
      const key = keyData && toBuffer(keyData)
      if (this._opts.cacheKey) {
        this._key = key
        if (this._opts.cacheTimeout) {
          setTimeout(() => delete this._key, this._opts.cacheTimeout)
        }
      }
      return key
    })
  }

  _loadEnvFromFile() {
    if (this._opts.file.substr(-5) !== '.json') {
      throw new UserError('Cryptex files must end in .json')
    }
    try {
      this._confFile = _.clone(require(path.resolve(this._opts.file)), true)
    } catch (e) {
      this._confFile = {}
    }
    return this._confFile[this._opts.env] || this._confFile[defaultEnv] || {}
  }

  static _bufferize(data, encoding) {
    let buf = data
    if (!Buffer.isBuffer(buf)) {
      buf = new Buffer(data.toString(), encoding)
    }
    return buf
  }

  static _require(dir, module) {
    if (module.indexOf(path.sep) >= 0) {
      throw new UserError(`Invalid module name: "${module}"`)
    }
    const reqPath = path.join(__dirname, dir, module)
    if (!Cryptex._requires[reqPath]) {
      Cryptex._requires[reqPath] = require(reqPath)
    }
    return Cryptex._requires[reqPath]
  }
}
Cryptex._requires = {}

const cryptex = new Cryptex()
cryptex.Cryptex = Cryptex
module.exports = cryptex
