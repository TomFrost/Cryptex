#!/usr/bin/env node
/*
 * Copyright (c) 2015-1016 TechnologyAdvice
 */

'use strict'

const cryptex = require('./index.js')
const pkg = require('../package.json')
const UserError = require('./lib/UserError')
const yargs = require('yargs')

const argv = yargs
  .usage('Usage: $0 [options] <command> <text>')
  .command('encrypt', 'Encrypt the given plaintext string')
  .command('decrypt', 'Decrypt the given base64 string')
  .command('getSecret', 'Decrypt the given stored secret')
  .demand(2)
  .option('e', {
    alias: 'environment',
    describe: 'The environment configuration to use'
  })
  .nargs('e', 1)
  .version(pkg.version)
  .help('help')
  .argv

/* eslint no-console:0 */
const output = console.log

function run() {
  cryptex.update({ env: argv.e })
  const command = argv._[0].toLowerCase()
  switch (command) {
  case 'encrypt':
    return cryptex.encrypt(argv._[1]).then(output)
  case 'decrypt':
    return cryptex.decrypt(argv._[1]).then(output)
  case 'getsecret':
    return cryptex.getSecret(argv._[1]).then(output)
  default:
    return Promise.resolve().then(yargs.showHelp())
  }
}

run().then(() => process.exit(0)).catch((err) => {
  if (err instanceof UserError) {
    process.stderr.write(`[ERROR] ${err.message}\n`)
  } else {
    process.stderr.write(`Uh-oh, we have a problem:\n${err.stack}\n`)
  }
  process.exit(1)
})
