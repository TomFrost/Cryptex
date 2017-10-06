/*
 * Copyright (c) 2017 Tom Shawver
 */

'use strict'

const getKey = require('src/keySources/env')

describe('Environment Source', () => {
  it('resolves with the provided key', () => {
    process.env.CRYPTEX_ENV_KEY = 'bar'

    return getKey().then((key) => {
      should.exist(key)
      key.should.equal('bar')
    })
  })
  it('rejects when option "key" is missing', () => {
    delete process.env.CRYPTEX_ENV_KEY
    return getKey().should.be.rejected
  })
})
