/*
 * Copyright (c) 2015 TechnologyAdvice
 */

import request from 'request';

export default function getKey(opts = {}) {
  const options = {
    url: process.env.CRYPTEX_KEYSOURCE_HTTP_URL || opts.url,
    timeout: process.env.CRYPTEX_KEYSOURCE_HTTP_TIMEOUT ?
      parseInt(process.env.CRYPTEX_KEYSOURCE_HTTP_TIMEOUT, 10) :
      opts.timeout || 4000,
    encoding: null
  };
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) {
        reject(err);
      } else if (res.statusCode !== 200) {
        reject(new Error(`Server responded ${res.statusCode} ${res.statusMessage}`));
      } else if (!body || !body.length) {
        reject(new Error('Server sent empty response body'));
      } else {
        resolve(body);
      }
    });
  });
}
