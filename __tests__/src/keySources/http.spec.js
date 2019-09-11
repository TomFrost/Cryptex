/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

const getKey = require('src/keySources/http')
const nock = require('nock')

const url = 'http://test.domain/key'

describe('HTTP Source', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  it('resolves with the downloaded key', async () => {
    const mock = nock('http://test.domain')
      .get('/key')
      .reply(200, 'foo')
    const key = await getKey({ url })
    expect(key).toBeInstanceOf(Buffer)
    expect(key.toString()).toEqual('foo')
    mock.done()
  })
  it('gets configuration from environment variables', async () => {
    const mock = nock('http://test.domain')
      .get('/key')
      .reply(200, 'foo')
    process.env.CRYPTEX_KEYSOURCE_HTTP_URL = url
    process.env.CRYPTEX_KEYSOURCE_HTTP_TIMEOUT = 500
    const key = await getKey({ url })
    expect(key).toBeInstanceOf(Buffer)
    expect(key.toString()).toEqual('foo')
    mock.done()
  })
  it('rejects if option "url" was not specified', () => {
    return expect(getKey()).rejects.toThrow()
  })
  it('rejects if a non-200 was encountered', () => {
    nock('http://test.domain')
      .get('/key')
      .reply(404, 'foo')
    return expect(getKey({ url })).rejects.toThrow()
  })
  it('rejects if the response body is empty', () => {
    nock('http://test.domain')
      .get('/key')
      .reply(200, '')
    return expect(getKey({ url })).rejects.toThrow()
  })
})
