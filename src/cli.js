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
  .usage('Usage: $0 [options] <command>')
  .command('encrypt <plaintext>', 'Encrypt the given plaintext string')
  .command('decrypt <base64>', 'Decrypt the given base64 string')
  .command('getSecret <secret>', 'Decrypt the given stored secret')
  .demand(2, 2, 'When encrypting, remember to quote strings with spaces!')
  .option('e', {
    alias: 'environment',
    describe: 'The environment configuration to use'
  })
  .nargs('e', 1)
  .option('f', {
    alias: 'file',
    describe: 'The path to the config file to use. By default, cryptex will attempt to load ' +
      'cryptex.json from the current directory.'
  })
  .nargs('f', 1)
  .version(pkg.version)
  .help('help')
  .strict()
  .argv

/* eslint no-console:0 */
const output = console.log

function run() {
  const cryptArgs = { env: argv.e }
  if (argv.f) cryptArgs.file = argv.f
  cryptex.update(cryptArgs)
  const command = argv._[0].toLowerCase()
  switch (command) {
  case 'encrypt':
    return cryptex.encrypt(argv.plaintext).then(output)
  case 'decrypt':
    return cryptex.decrypt(argv.base64).then(output)
  case 'getsecret':
    return cryptex.getSecret(argv.secret).then(output)
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
