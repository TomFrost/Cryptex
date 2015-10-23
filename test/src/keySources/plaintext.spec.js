/*
 * Copyright (c) 2015 TechnologyAdvice
 */

import getKey from 'src/keySources/plaintext';

describe('Plaintext Source', () => {
  it('resolves with the provided key', () => {
    return getKey({key: 'foo'}).then((key) => {
      should.exist(key);
      key.should.equal('foo');
    });
  });
  it('rejects when option "key" is missing', () => {
    return getKey().should.be.rejected;
  });
});
