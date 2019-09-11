/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

const getKey = require('src/keySources/none')

describe('None Source', () => {
  it('resolves with a null key', () => {
    return expect(getKey()).resolves.toBeNull()
  })
})
