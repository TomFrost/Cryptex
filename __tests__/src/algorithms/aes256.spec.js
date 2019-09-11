/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

const AES256 = require('src/algorithms/aes256')
const crypto = require('crypto')

const algo = new AES256()
const fooEnc = 'Q+JfrQS5DtSjqWHu1oO4HqctA2hVw4VhaDQfBCuvO8U='
const key = new Buffer('WJcfREHOMttStwb1927PQwpDJgOgRyVoVMODQxx3pK4=', 'base64')

const origRandomBytes = crypto.randomBytes

describe('AES256 Algorithm', () => {
  afterEach(() => {
    crypto.randomBytes = origRandomBytes
  })
  it('decrypts a known secret from a string', async () => {
    const foo = await algo.decrypt(key, fooEnc)
    expect(foo).toEqual('foo')
  })
  it('decrypts a known secret from a buffer', async () => {
    const foo = await algo.decrypt(key, new Buffer(fooEnc, 'base64'))
    expect(foo).toEqual('foo')
  })
  it('encrypts a string into base64', async () => {
    const enc = await algo.encrypt(key, 'foo')
    expect(enc).toHaveProperty('length', fooEnc.length)
    expect(enc).toMatch(/=$/)
  })
  it('encrypts a buffer into base64', async () => {
    const enc = await algo.encrypt(key, new Buffer('foo'))
    expect(enc).toHaveProperty('length', fooEnc.length)
    expect(enc).toMatch(/=$/)
  })
  it('results in the same short string after encrypt/decrypt', async () => {
    const enc = await algo.encrypt(key, 'bar')
    const dec = await algo.decrypt(key, enc)
    expect(dec).toEqual('bar')
  })
  it('results in the same long string after encrypt/decrypt', async () => {
    const str = 'this_is_a_long_string_yep_it_sure_is_golly_gee'
    const enc = await algo.encrypt(key, str)
    const dec = await algo.decrypt(key, enc)
    expect(dec).toEqual(str)
  })
  it('does not produce the same encrypted string twice', async () => {
    const res = await Promise.all([
      algo.encrypt(key, 'foo'),
      algo.encrypt(key, 'foo')
    ])
    expect(res[0]).not.toEqual(res[1])
  })
  it('rejects when the RNG fails', () => {
    crypto.randomBytes = jest.fn((bytes, cb) => {
      cb(new Error('foo'))
    })
    return expect(algo.encrypt(key, 'foo')).rejects.toThrow('foo')
  })
})
