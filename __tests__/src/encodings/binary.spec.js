/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

const toBuffer = require('src/encodings/binary')

describe('Binary Encoding', () => {
  it('returns the same buffer that was provided', () => {
    const buf = toBuffer(new Buffer('foo'))
    expect(buf).toBeInstanceOf(Buffer)
    expect(buf.toString()).toEqual('foo')
  })
})
