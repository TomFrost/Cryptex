/*
 * Copyright (c) 2015 TechnologyAdvice
 */

export default function getKey(opts = {}) {
  const key = process.env.CRYPTEX_KEYSOURCE_PLAINTEXT_KEY || opts.key;
  if (key) {
    return Promise.resolve(key);
  }
  return Promise.reject(new Error('Plaintext source: Option "key" is not defined'));
}
