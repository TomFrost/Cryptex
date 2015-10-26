/*
 * Copyright (c) 2015 TechnologyAdvice
 */

import AWS from 'aws-sdk';

function getKey(opts = {}) {
  const region = process.env.CRYPTEX_KEYSOURCE_KMS_REGION || opts.region;
  if (region) {
    AWS.config.update({ region });
  }
  const kms = new AWS.KMS();
  opts.dataKey = process.env.CRYPTEX_KEYSOURCE_KMS_DATAKEY || opts.dataKey;
  return new Promise((resolve, reject) => {
    if (!opts.dataKey) {
      reject(new Error('KMS Source: "dataKey" option is required'));
    } else {
      let params = {
        CiphertextBlob: new Buffer(opts.dataKey, 'base64')
      };
      kms.decrypt(params, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.Plaintext);
        }
      });
    }
  });
}

getKey.AWS = AWS;
export default getKey;
