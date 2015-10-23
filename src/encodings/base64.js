/*
 * Copyright (c) 2015 TechnologyAdvice
 */

export default function toBuffer(data) {
  const base64Str = Buffer.isBuffer(data) ? data.toString() : data;
  return new Buffer(base64Str, 'base64');
}
