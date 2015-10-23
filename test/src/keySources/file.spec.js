/*
 * Copyright (c) 2015 TechnologyAdvice
 */

import fs from 'fs';
import getKey from 'src/keySources/file';
import tmp from 'tmp';

let tmpFile;

describe('File Source', () => {
  before((done) => {
    tmp.tmpName((err, path) => {
      tmpFile = path;
      if (err) done(err);
      else {
        fs.writeFile(path, 'foo', done);
      }
    });
  });
  after((done) => {
    fs.unlink(tmpFile, done);
  });
  it('resolves with the file contents', () => {
    return getKey({path: tmpFile}).then((key) => {
      should.exist(key);
      key.should.be.instanceof(Buffer);
      key.toString().should.equal('foo');
    });
  });
  it('rejects when option "path" is missing', () => {
    return getKey().should.be.rejected;
  });
  it('rejects when path does not exist', () => {
    return getKey({path: '/lol/no'}).should.be.rejected;
  });
});
