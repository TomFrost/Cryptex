/*
 * Copyright (c) 2015-1016 TechnologyAdvice
 */

'use strict'

const getKey = require('src/keySources/none')

describe('None Source', () => {
  it('resolves with a null key', () => {
    return getKey().then((key) => {
      should.not.exist(key)
    })
  })
})
