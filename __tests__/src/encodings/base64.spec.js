/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

const toBuffer = require('src/encodings/base64')

const fooBase64 = 'Zm9v'

describe('Base64 Encoding', () => {
  it('returns a buffer of binary data from a base64 string', () => {
    const buf = toBuffer(fooBase64)
    expect(buf).toBeInstanceOf(Buffer)
    expect(buf.toString()).toEqual('foo')
  })
  it('returns a buffer of binary data from a base64 string in a Buffer', () => {
    const buf = toBuffer(new Buffer(fooBase64))
    expect(buf).toBeInstanceOf(Buffer)
    expect(buf.toString()).toEqual('foo')
  })
})
