/*
 * Copyright (c) 2015-1016 TechnologyAdvice
 */

'use strict'

const toBuffer = require('src/encodings/hex')

const fooHex = '666f6f'

describe('Hex Encoding', () => {
  it('returns a buffer of binary data from a hex string', () => {
    let buf = toBuffer(fooHex)
    should.exist(buf)
    buf.should.be.instanceof(Buffer)
    buf.toString().should.equal('foo')
  })
  it('returns a buffer of binary data from a hex string in a Buffer', () => {
    let buf = toBuffer(new Buffer(fooHex))
    should.exist(buf)
    buf.should.be.instanceof(Buffer)
    buf.toString().should.equal('foo')
  })
})
