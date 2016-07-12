/*
 * Copyright (c) 2015-1016 TechnologyAdvice
 */

'use strict'

const getKey = require('src/keySources/http')
const nock = require('nock')

const url = 'http://test.domain/key'

describe('HTTP Source', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  it('resolves with the downloaded key', () => {
    let mock = nock('http://test.domain')
      .get('/key')
      .reply(200, 'foo')
    return getKey({ url }).then((key) => {
      should.exist(key)
      key.should.be.instanceOf(Buffer)
      key.toString().should.equal('foo')
      mock.done()
    })
  })
  it('gets configuration from environment variables', () => {
    let mock = nock('http://test.domain')
      .get('/key')
      .reply(200, 'foo')
    process.env.CRYPTEX_KEYSOURCE_HTTP_URL = url
    process.env.CRYPTEX_KEYSOURCE_HTTP_TIMEOUT = 500
    return getKey({ url }).then((key) => {
      should.exist(key)
      key.should.be.instanceOf(Buffer)
      key.toString().should.equal('foo')
      mock.done()
    })
  })
  it('rejects if option "url" was not specified', () => {
    return getKey().should.be.rejected
  })
  it('rejects if a non-200 was encountered', () => {
    nock('http://test.domain')
      .get('/key')
      .reply(404, 'foo')
    return getKey({ url }).should.be.rejected
  })
  it('rejects if the response body is empty', () => {
    nock('http://test.domain')
      .get('/key')
      .reply(200, '')
    return getKey({ url }).should.be.rejected
  })
})
