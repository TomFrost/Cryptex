/*
 * Copyright (c) 2017-2019 Tom Shawver
 */

'use strict'

const fs = require('fs')
const getKey = require('src/keySources/file')
const tmp = require('tmp')

let tmpFile

describe('File Source', () => {
  beforeAll(done => {
    tmp.tmpName((err, path) => {
      tmpFile = path
      if (err) done(err)
      else {
        fs.writeFile(path, 'foo', done)
      }
    })
  })
  afterAll(done => {
    fs.unlink(tmpFile, done)
  })
  it('resolves with the file contents', () => {
    return getKey({ path: tmpFile }).then(key => {
      expect(key).toBeInstanceOf(Buffer)
      expect(key.toString()).toEqual('foo')
    })
  })
  it('rejects when option "path" is missing', () => {
    return expect(getKey()).rejects.toThrow()
  })
  it('rejects when path does not exist', () => {
    return expect(getKey({ path: '/lol/no' })).rejects.toThrow()
  })
})
