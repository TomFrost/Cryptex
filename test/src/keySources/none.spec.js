/*
 * Copyright (c) 2017 Tom Shawver
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
