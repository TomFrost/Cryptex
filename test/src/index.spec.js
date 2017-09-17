/*
 * Copyright (c) 2017 Tom Shawver
 */

'use strict'

const _ = require('lodash')
const Cryptex = require('src').Cryptex
const path = require('path')

const originalEnvs = _.clone(process.env)
const fooEnc = 'Q+JfrQS5DtSjqWHu1oO4HqctA2hVw4VhaDQfBCuvO8U='
const key = 'WJcfREHOMttStwb1927PQwpDJgOgRyVoVMODQxx3pK4='

describe('Cryptex Class', () => {
  afterEach(() => {
    process.env = _.clone(originalEnvs)
  })
  describe('Core API', () => {
    it('constructs without options', () => {
      const cryptex = new Cryptex()
      should.exist(cryptex)
      cryptex.should.be.instanceOf(Cryptex)
    })
    it('constructs with options', () => {
      const cryptex = new Cryptex({env: 'foo'})
      should.exist(cryptex)
      cryptex.should.be.instanceOf(Cryptex)
      cryptex._opts.env.should.equal('foo')
    })
    it('decrypts secret with hardcoded config', () => {
      const cryptex = new Cryptex({
        config: {
          keySource: 'plaintext',
          keySourceEncoding: 'base64',
          keySourceOpts: { key },
          algorithm: 'aes256',
          secrets: {
            foo: fooEnc
          }
        }
      })
      return cryptex.getSecret('foo').should.eventually.equal('foo')
    })
    it('decrypts secret with env var config', () => {
      const cryptex = new Cryptex()
      process.env.CRYPTEX_KEYSOURCE = 'plaintext'
      process.env.CRYPTEX_KEYSOURCEENCODING = 'base64'
      process.env.CRYPTEX_KEYSOURCE_PLAINTEXT_KEY = key
      process.env.CRYPTEX_ALGORITHM = 'aes256'
      process.env.CRYPTEX_SECRET_FOO = fooEnc
      process.env.CRYPTEX_SECRETENCODING = 'base64'
      cryptex.update()
      return cryptex.getSecret('foo').should.eventually.equal('foo')
    })
    it('decrypts a base64 string', () => {
      process.env.CRYPTEX_KEYSOURCE = 'plaintext'
      process.env.CRYPTEX_KEYSOURCEENCODING = 'base64'
      process.env.CRYPTEX_KEYSOURCE_PLAINTEXT_KEY = key
      const cryptex = new Cryptex()
      return cryptex.decrypt(fooEnc).should.eventually.equal('foo')
    })
    it('encrypts and decrypts a UTF-8 string', () => {
      process.env.CRYPTEX_KEYSOURCE = 'plaintext'
      process.env.CRYPTEX_KEYSOURCEENCODING = 'base64'
      process.env.CRYPTEX_KEYSOURCE_PLAINTEXT_KEY = key
      const cryptex = new Cryptex()
      return cryptex.encrypt('foo').then((enc) => {
        should.exist(enc)
        enc.should.be.a.string
        enc.length.should.be.greaterThan(0)
        enc[enc.length - 1].should.equal('=')
        return cryptex.decrypt(enc)
      }).then((dec) => {
        should.exist(dec)
        dec.should.equal('foo')
      })
    })
    it('encrypts and decrypts a base64 string', () => {
      process.env.CRYPTEX_KEYSOURCE = 'plaintext'
      process.env.CRYPTEX_KEYSOURCEENCODING = 'base64'
      process.env.CRYPTEX_KEYSOURCE_PLAINTEXT_KEY = key
      const cryptex = new Cryptex()
      return cryptex.encrypt('Zm9v', 'base64').then((enc) => {
        should.exist(enc)
        enc.should.be.a.string
        enc.length.should.be.greaterThan(0)
        enc[enc.length - 1].should.equal('=')
        return cryptex.decrypt(enc)
      }).then((dec) => {
        should.exist(dec)
        dec.should.equal('foo')
      })
    })
    it('loads config from a file', () => {
      const cryptex = new Cryptex({
        file: path.join(__dirname, '../fixtures/cryptex.json')
      })
      return cryptex.getSecret('foo').should.eventually.equal('bar')
    })
    it('decrypts a secret with mixed configs', () => {
      const cryptex = new Cryptex({
        config: {
          keySource: 'plaintext',
          keySourceEncoding: 'base64',
          keySourceOpts: { key }
        }
      })
      process.env.CRYPTEX_SECRET_FOO = fooEnc
      return cryptex.getSecret('foo').should.eventually.equal('foo')
    })
    it('retrieves multiple secrets', () => {
      const secrets = {
        foo: 'foo',
        bar: 'bar',
        baz: 'baz'
      }
      const cryptex = new Cryptex({
        config: {
          keySource: 'none',
          algorithm: 'plaintext',
          secretEncoding: 'utf8',
          secrets
        }
      })
      return cryptex.getSecrets(['foo', 'bar', 'baz']).should.eventually.eql(secrets)
    })
    it('retrieves multiple secrets with null for any not found', () => {
      const secrets = {
        foo: 'foo',
        bar: 'bar'
      }
      const cryptex = new Cryptex({
        config: {
          keySource: 'none',
          algorithm: 'plaintext',
          secretEncoding: 'utf8',
          secrets
        }
      })
      return cryptex.getSecrets(['foo', 'bar', 'baz'], true).should.eventually.eql({
        foo: 'foo',
        bar: 'bar',
        baz: null
      })
    })
  })
  describe('Failure cases', () => {
    it('prevents module path injections', () => {
      const cryptex = new Cryptex({
        config: {
          keySource: '../encodings/hex'
        }
      })
      process.env.CRYPTEX_SECRET_FOO = fooEnc
      return cryptex.getSecret('foo').should.be.rejected
    })
    it('rejects on missing modules', () => {
      const cryptex = new Cryptex({
        config: {
          keySource: 'foo'
        }
      })
      process.env.CRYPTEX_SECRET_FOO = fooEnc
      return cryptex.getSecret('foo').should.be.rejected
    })
    it('rejects on missing required secrets', () => {
      process.env.CRYPTEX_KEYSOURCE = 'plaintext'
      process.env.CRYPTEX_KEYSOURCEENCODING = 'base64'
      process.env.CRYPTEX_KEYSOURCE_PLAINTEXT_KEY = key
      const cryptex = new Cryptex({config: {}})
      return cryptex.getSecret('foo').should.be.rejected
    })
    it('resolves null on missing optional secrets', () => {
      process.env.CRYPTEX_KEYSOURCE = 'plaintext'
      process.env.CRYPTEX_KEYSOURCEENCODING = 'base64'
      process.env.CRYPTEX_KEYSOURCE_PLAINTEXT_KEY = key
      const cryptex = new Cryptex({config: {}})
      return cryptex.getSecret('foo', true).should.eventually.be.null
    })
    it('throws on non-json config', () => {
      process.env.CRYPTEX_FILE = '../somefile.js'
      let success = false
      try {
        const cryptex = new Cryptex()
        should.not.exist(cryptex)
      } catch (e) {
        success = true
        e.should.be.instanceOf(Error)
      }
      if (!success) {
        throw new Error('should not be reachable')
      }
    })
    it('falls back to empty config on file not found', () => {
      process.env.CRYPTEX_FILE = 'somefile.json'
      const cryptex = new Cryptex()
      should.exist(cryptex)
    })
    it('rejects when no keySource is set', () => {
      const cryptex = new Cryptex({
        config: {
          algorithm: 'plaintext',
          secretEncoding: 'utf8',
          secrets: {foo: 'bar'}
        }
      })
      return cryptex.getSecret('foo').should.be.rejected
    })
    it('retrieves multiple secrets and rejects for any not found', () => {
      const secrets = {
        foo: 'foo',
        bar: 'bar'
      }
      const cryptex = new Cryptex({
        config: {
          keySource: 'none',
          algorithm: 'plaintext',
          secretEncoding: 'utf8',
          secrets
        }
      })
      return cryptex.getSecrets(['foo', 'bar', 'baz']).should.be.rejected
    })
  })
  describe('Key caching', () => {
    let clock
    beforeEach(() => {
      clock = sinon.useFakeTimers()
    })
    afterEach(() => {
      clock.restore()
    })
    it('does not cache when caching is disabled', () => {
      process.env.CRYPTEX_KEYSOURCE = 'plaintext'
      process.env.CRYPTEX_KEYSOURCEENCODING = 'base64'
      process.env.CRYPTEX_KEYSOURCE_PLAINTEXT_KEY = key
      process.env.CRYPTEX_CACHEKEY = 'false'
      const cryptex = new Cryptex()
      return cryptex.decrypt(fooEnc).then(() => {
        cryptex.should.not.have.property('_key')
      })
    })
    it('does not cache when caching is disabled', () => {
      process.env.CRYPTEX_KEYSOURCE = 'plaintext'
      process.env.CRYPTEX_KEYSOURCEENCODING = 'base64'
      process.env.CRYPTEX_KEYSOURCE_PLAINTEXT_KEY = key
      process.env.CRYPTEX_CACHEKEY = 'false'
      const cryptex = new Cryptex()
      return cryptex.decrypt(fooEnc).then(() => {
        cryptex.should.not.have.property('_key')
      })
    })
    it('does not expire cache with timeout=0', () => {
      process.env.CRYPTEX_KEYSOURCE = 'plaintext'
      process.env.CRYPTEX_KEYSOURCEENCODING = 'base64'
      process.env.CRYPTEX_KEYSOURCE_PLAINTEXT_KEY = key
      process.env.CRYPTEX_CACHEKEY = 'true'
      process.env.CRYPTEX_CACHETIMEOUT = '0'
      const cryptex = new Cryptex()
      return cryptex.decrypt(fooEnc).then(() => {
        clock.tick(10000)
        cryptex.should.have.property('_key')
      })
    })
    it('expires cache after specified timeout', () => {
      process.env.CRYPTEX_KEYSOURCE = 'plaintext'
      process.env.CRYPTEX_KEYSOURCEENCODING = 'base64'
      process.env.CRYPTEX_KEYSOURCE_PLAINTEXT_KEY = key
      process.env.CRYPTEX_CACHEKEY = 'true'
      process.env.CRYPTEX_CACHETIMEOUT = '2000'
      const cryptex = new Cryptex()
      return cryptex.decrypt(fooEnc).then(() => {
        clock.tick(2010)
        cryptex.should.not.have.property('_key')
      })
    })
  })
})
