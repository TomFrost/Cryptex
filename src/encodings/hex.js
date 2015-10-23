/*
 * Copyright (c) 2015 TechnologyAdvice
 */

export default function toBuffer(data) {
  let hexStr = Buffer.isBuffer(data) ? data.toString() : data;
  hexStr = hexStr.toLowerCase();
  return new Buffer(hexStr, 'hex');
}
