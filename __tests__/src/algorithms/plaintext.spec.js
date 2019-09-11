/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

const Plaintext = require('src/algorithms/plaintext')

const algo = new Plaintext()

describe('Plaintext Algorithm', () => {
  it('passes back the provided string on encrypt', async () => {
    const foo = await algo.encrypt(null, 'foo')
    expect(foo).toEqual('foo')
  })
  it('passes back the provided string on decrypt', async () => {
    const foo = await algo.decrypt(null, 'foo')
    expect(foo).toEqual('foo')
  })
})
