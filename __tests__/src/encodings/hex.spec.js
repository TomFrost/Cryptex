/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

const toBuffer = require('src/encodings/hex')

const fooHex = '666f6f'

describe('Hex Encoding', () => {
  it('returns a buffer of binary data from a hex string', () => {
    const buf = toBuffer(fooHex)
    expect(buf).toBeInstanceOf(Buffer)
    expect(buf.toString()).toEqual('foo')
  })
  it('returns a buffer of binary data from a hex string in a Buffer', () => {
    const buf = toBuffer(new Buffer(fooHex))
    expect(buf).toBeInstanceOf(Buffer)
    expect(buf.toString()).toEqual('foo')
  })
})
