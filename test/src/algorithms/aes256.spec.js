/*
 * Copyright (c) 2015-1016 TechnologyAdvice
 */

'use strict'

const AES256 = require('src/algorithms/aes256')
const crypto = require('crypto')

const algo = new AES256()
const fooEnc = 'Q+JfrQS5DtSjqWHu1oO4HqctA2hVw4VhaDQfBCuvO8U='
const key = new Buffer('WJcfREHOMttStwb1927PQwpDJgOgRyVoVMODQxx3pK4=', 'base64')

let stub

describe('AES256 Algorithm', () => {
  afterEach(() => {
    if (stub) {
      stub.restore()
      stub = undefined
    }
  })
  it('decrypts a known secret from a string', () => {
    return algo.decrypt(key, fooEnc).then((foo) => {
      should.exist(foo)
      foo.should.be.a.string
      foo.should.equal('foo')
    })
  })
  it('decrypts a known secret from a buffer', () => {
    return algo.decrypt(key, new Buffer(fooEnc, 'base64')).then((foo) => {
      should.exist(foo)
      foo.should.be.a.string
      foo.should.equal('foo')
    })
  })
  it('encrypts a string into base64', () => {
    return algo.encrypt(key, 'foo').then((enc) => {
      should.exist(enc)
      enc.should.be.a.string
      enc.should.have.property('length').equal(fooEnc.length)
      enc[enc.length - 1].should.equal('=')
    })
  })
  it('encrypts a buffer into base64', () => {
    return algo.encrypt(key, new Buffer('foo')).then((enc) => {
      should.exist(enc)
      enc.should.be.a.string
      enc.should.have.property('length').equal(fooEnc.length)
      enc[enc.length - 1].should.equal('=')
    })
  })
  it('results in the same short string after encrypt/decrypt', () => {
    return algo.encrypt(key, 'bar')
      .then((enc) => algo.decrypt(key, enc))
      .then((dec) => {
        should.exist(dec)
        dec.should.be.a.string
        dec.should.equal('bar')
      })
  })
  it('results in the same long string after encrypt/decrypt', () => {
    let str = 'this_is_a_long_string_yep_it_sure_is_golly_gee'
    return algo.encrypt(key, str)
      .then((enc) => algo.decrypt(key, enc))
      .then((dec) => {
        should.exist(dec)
        dec.should.be.a.string
        dec.should.equal(str)
      })
  })
  it('does not produce the same encrypted string twice', () => {
    return Promise.all([
      algo.encrypt(key, 'foo'),
      algo.encrypt(key, 'foo')
    ]).then((res) => {
      should.exist(res)
      res.should.have.property('length').equal(2)
      res[0].should.not.equal(res[1])
    })
  })
  it('rejects when the RNG fails', () => {
    stub = sinon.stub(crypto, 'randomBytes', (bytes, cb) => {
      cb(new Error('foo'))
    })
    return algo.encrypt(key, 'foo').should.be.rejected
  })
})
