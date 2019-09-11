/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

const AWS = require('aws-sdk')
const getKey = require('src/keySources/kms')
const nock = require('nock')

const dataKey = 'foo='
const plainKey = 'WJcfREHOMttStwb1927PQwpDJgOgRyVoVMODQxx3pK4='

describe('KMS Source', () => {
  afterEach(() => nock.cleanAll())
  beforeEach(() => {
    AWS.config.update({
      accessKeyId: '1234567890',
      secretAccessKey: '1234567890',
      region: 'us-east-1'
    })
  })
  it('resolves with the provided key', async () => {
    const mock = nock('https://kms.us-east-1.amazonaws.com:443')
      .post('/', { CiphertextBlob: dataKey })
      .reply(
        200,
        {
          KeyId:
            'arn:aws:kms:us-east-1:123456789012:key/' +
            '12345678-1234-4321-1234-123456789012',
          Plaintext: plainKey
        },
        {
          server: 'Server',
          date: 'Thu, 22 Oct 2015 02:00:46 GMT',
          'content-type': 'application/x-amz-json-1.1',
          'content-length': '146',
          connection: 'close',
          'x-amzn-requestid': '12345678-1234-1234-1234-123456789012'
        }
      )
    const key = await getKey({ dataKey })
    expect(key).toBeInstanceOf(Buffer)
    expect(key.length).toBeGreaterThan(0)
    expect(key.toString('base64')).toEqual(plainKey)
    mock.done()
  })
  it('allows region to be specified', async () => {
    const mock = nock('https://kms.us-west-1.amazonaws.com:443')
      .post('/', { CiphertextBlob: dataKey })
      .reply(
        200,
        {
          KeyId:
            'arn:aws:kms:us-west-1:123456789012:key/' +
            '12345678-1234-4321-1234-123456789012',
          Plaintext: plainKey
        },
        {
          server: 'Server',
          date: 'Thu, 22 Oct 2015 02:00:46 GMT',
          'content-type': 'application/x-amz-json-1.1',
          'content-length': '146',
          connection: 'close',
          'x-amzn-requestid': '12345678-1234-1234-1234-123456789012'
        }
      )
    const key = await getKey({ dataKey, region: 'us-west-1' })
    expect(key).toBeInstanceOf(Buffer)
    mock.done()
  })
  it('rejects on bad HTTP response', () => {
    nock('https://kms.us-east-1.amazonaws.com:443')
      .post('/', { CiphertextBlob: dataKey })
      .reply(503)
    return expect(getKey({ dataKey })).rejects.toThrow()
  })
  it('rejects when option "dataKey" is missing', () => {
    return expect(getKey({ dataKey })).rejects.toThrow()
  })
})
