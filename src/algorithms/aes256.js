/*
 * Copyright (c) 2015 TechnologyAdvice
 */

import SymmetricAlgo from '../lib/SymmetricAlgo';

export default class AES256 extends SymmetricAlgo {
  constructor() {
    super('aes256', 16);
  }
}
