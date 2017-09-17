/*
 * Copyright (c) 2017 Tom Shawver
 */

'use strict'

const fs = require('fs')
const getKey = require('src/keySources/file')
const tmp = require('tmp')

let tmpFile

describe('File Source', () => {
  before((done) => {
    tmp.tmpName((err, path) => {
      tmpFile = path
      if (err) done(err)
      else {
        fs.writeFile(path, 'foo', done)
      }
    })
  })
  after((done) => {
    fs.unlink(tmpFile, done)
  })
  it('resolves with the file contents', () => {
    return getKey({path: tmpFile}).then((key) => {
      should.exist(key)
      key.should.be.instanceof(Buffer)
      key.toString().should.equal('foo')
    })
  })
  it('rejects when option "path" is missing', () => {
    return getKey().should.be.rejected
  })
  it('rejects when path does not exist', () => {
    return getKey({path: '/lol/no'}).should.be.rejected
  })
})
