/*
 * Copyright (c) 2015 TechnologyAdvice
 */

import toBuffer from 'src/encodings/base64';

const fooBase64 = 'Zm9v';

describe('Base64 Encoding', () => {
  it('returns a buffer of binary data from a base64 string', () => {
    let buf = toBuffer(fooBase64);
    should.exist(buf);
    buf.should.be.instanceof(Buffer);
    buf.toString().should.equal('foo');
  });
  it('returns a buffer of binary data from a base64 string in a Buffer', () => {
    let buf = toBuffer(new Buffer(fooBase64));
    should.exist(buf);
    buf.should.be.instanceof(Buffer);
    buf.toString().should.equal('foo');
  });
});
