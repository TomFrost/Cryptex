/*
 * Copyright (c) 2015 TechnologyAdvice
 */

import getKey from 'src/keySources/none';

describe('None Source', () => {
  it('resolves with a null key', () => {
    return getKey().then((key) => {
      should.not.exist(key);
    });
  });
});
