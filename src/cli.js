#!/usr/bin/env node
/*
 * Copyright (c) 2015 TechnologyAdvice
 */

import cryptex from './index.js';
import pkg from '../package.json';
import UserError from './lib/UserError';
import yargs from 'yargs';

const argv = yargs
  .usage('Usage: $0 [options] <command> <text>')
  .command('encrypt', 'Encrypt the given plaintext string')
  .command('decrypt', 'Decrypt the given base64 string')
  .demand(2)
  .option('e', {
    alias: 'environment',
    describe: 'The environment configuration to use'
  })
  .nargs('e', 1)
  .version(pkg.version)
  .help('help')
  .argv;

/* eslint no-console:0 */
const output = console.log;

function run() {
  cryptex.update({ env: argv.e });
  switch (argv._[0]) {
  case 'encrypt':
    return cryptex.encrypt(argv._[1]).then(output);
  case 'decrypt':
    return cryptex.decrypt(argv._[1]).then(output);
  default:
    return Promise.resolve().then(yargs.showHelp());
  }
}

run().then(() => process.exit(0)).catch((err) => {
  if (err instanceof UserError) {
    process.stderr.write(`[ERROR] ${err.message}\n`);
  } else {
    process.stderr.write(`Uh-oh, we have a problem:\n${err.stack}\n`);
  }
  process.exit(1);
});
