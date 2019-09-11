/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

const getKey = require('src/keySources/plaintext')

describe('Plaintext Source', () => {
  it('resolves with the provided key', async () => {
    const key = await getKey({ key: 'foo' })
    expect(key).toEqual('foo')
  })
  it('rejects when option "key" is missing', () => {
    return expect(getKey()).rejects.toThrow()
  })
})
