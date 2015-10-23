<a href="http://promisesaplus.com/">
    <img src="https://promises-aplus.github.io/promises-spec/assets/logo-small.png"
         align="right" valign="top" alt="Promises/A+ logo" />
</a>
# Cryptex [![Build Status](https://travis-ci.org/TechnologyAdvice/Cryptex.svg?branch=master)](https://travis-ci.org/TechnologyAdvice/Cryptex) [![Code Climate](https://codeclimate.com/github/TechnologyAdvice/Cryptex/badges/gpa.svg)](https://codeclimate.com/github/TechnologyAdvice/Cryptex) [![Test Coverage](https://codeclimate.com/github/TechnologyAdvice/Cryptex/badges/coverage.svg)](https://codeclimate.com/github/TechnologyAdvice/Cryptex/coverage) 
Secure secret storage and cryptographic key retrieval for Node.js

```javascript
var cryptex = require('cryptex');

cryptex.getSecret('mySQLPass').then(function(pass) {
  conn = mysql.connect({
    user: username,
    password: pass,
    host: hostname
  });
});
```

## Keep your secrets secret!
If you check database passwords into git, download credential files from S3 or some
other server, provide plaintext keys to your continuous integration/deployment solution,
or don't have the ability to limit engineers from getting production secrets, stop
doing what you're doing.

Cryptex is here to help.  Here's how:

### 1. Pick a configuration method
There are three ways to set up Cryptex. Use what works best for your project:

#### cryptex.json in your app root
Set up cryptex in different ways automatically depending on what the `NODE_ENV`
environment variable is set to. The file looks like this:

```json
{
  "production": {
    "keySource": "kms",
    "keySourceOpts": {
      "dataKey": "kms+encrypted+base64+string=="
    }
  },
  "development": {
    "algorithm": "plaintext",
    "secretEncoding": "utf8",
    "secrets": {
      "mySQLPass": "devlocal"
    }
  }
}
```

#### Put it right in the code
Don't want clutter in your file tree? That's cool. Do this:

```javascript
cryptex.use({
  config: {
    keySource: 'kms',
    keySourceOpts: {
      dataKey: 'kms+encrypted+base64+string=='
    }
  }
});
```

#### Throw it all in environment variables
Following [12 Factor](http://12factor.net/)? Rock on. We have env var support already
built-in.

```
CRYPTEX_KEYSOURCE=kms
CRYPTEX_KEYSOURCE_KMS_DATAKEY="kms+encrypted+base64+string=="
```

### 2. Pick a key source
Cryptex encrypts all of your secrets with a key. You don't want that key shared with
anyone in plaintext, no matter how much you trust them. Cryptex will request your key
when it's needed and delete it from RAM afterward.  Here are the available sources:

#### Amazon KMS _("kms")_
Amazon Web Services' [Key Management System](https://aws.amazon.com/kms/) is the most
secure and easy-to-implement key source. If you already have an AWS account, KMS is
cheap and easy to use. Create an encryption key using the IAM console, and note the
alias you gave it. Install the
[AWS CLI tool](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) and
run this command with your key alias to get an encrypted AES256 key:

```
aws kms generate-data-key-without-plaintext \
  --key-id alias/YOUR_KEY_ALIAS \
  --key-spec AES_256 \
  --output text \
  --query CiphertextBlob
```

##### kms options:
`dataKey` `CRYPTEX_KEYSOURCE_KMS_PATH`: The base64 string you got when you ran that
command above

#### Load from file _("file")_
If your secure key is available in a file, use this method. Note, however, that it is
your responsibility to make sure that key file stays secure and inaccessible to prying
eyes!

Is your key file something other than binary-encoded? Set `keySourceEncoding` in your
config, or set the `CRYPTEX_KEYSOURCEENCODING` environment variable, to either `base64`
or `hex`.

##### file options:
`path` `CRYPTEX_KEYSOURCE_FILE_PATH`: The path to the key file

#### Download via http(s) _("http")_
**DANGER.** _ONLY USE THIS IF YOU ABSOLUTELY KNOW WHAT YOU'RE DOING._

If you're using anything other than an https URL in production, you're _definitely_
doing it wrong. You'll need to be an expert in locking your key server down for this
to be anywhere near secure.

As with `file`, if your key file is something other than binary-encoded, set
`keySourceEncoding` in your config, or set the `CRYPTEX_KEYSOURCEENCODING` environment
variable, to either `base64` or `hex`.

##### http options:
`url` `CRYPTEX_KEYSOURCE_HTTP_URL`: The URL to the key file to download  
`timeout` `CRYPTEX_KEYSOURCE_HTTP_TIMEOUT`: The number of milliseconds after which to
fail the download. _(Default: 4000)_

#### Plain text _("plaintext")_
**DANGER.** _SHOULD NEVER BE USED IN PRODUCTION._

Useful for local development and testing, this allows the key to be saved in plain
text. You'll also want to set `keySourceEncoding` in your config (or the
`CRYPTEX_KEYSOURCEENCODING` environment variable) to either `base64` or `hex` --
however you've stringified your key.

##### plaintext options:
`key` `CRYPTEX_KEYSOURCE_PLAINTEXT_KEY`: Your key, in plain text

#### No key _("none")_
This is useful if you're plugging in an algorithm that doesn't require a pre-set key
to be used.

### 3. Pick an encryption algorithm
The recommended and default algorithm is `aes256`. If you're good with that, move on!
You don't even need to set `algorithm` in your config or the `CRYPTEX_ALGORITHM`
environment variable. But for the sake of completeness:

#### AES 256-bit _("aes256")_
Military-grade symmetric encryption. The implementation in Cryptex computes a new
random 128-bit initialization vector for each encrypted secret. Obviously, to use this,
the key provided by your keySource must be a 256-bit AES key.

#### Plain text _("plaintext")_
**DANGER.** _SHOULD NEVER BE USED IN PRODUCTION._

Useful for local development. With this, no keySource is needed and all secrets can
be stored in plain text.  Remember to set `secretEncoding` in your config, or the
`CRYPTEX_SECRETENCODING` environment variable, to `utf8`.

### 4. Secure your secrets
If you installed Cryptex globally, you'll have a CLI tool called `cryptex` that can
encrypt and decrypt your keys according to your `cryptex.json` or environment
variables. It's this easy:

```
$ cryptex encrypt mypassword
Q+JfrQS5DtSjqWHu1oO4HqctA2hVw4VhaDQfBCuvO8U=
```

To specify a particular node environment (for `cryptex.json` users), pass it in the
`-e` flag. Run `cryptex --help` for all the details.

### 5. Save your secrets
Provide your secrets to production by either putting them in your config like this...

```json
// cryptex.json
{
"production": {
  "keySource": "kms",
  "keySourceOpts": {
    "dataKey": "kms+encrypted+base64+string=="
  },
  "secrets": {
    "mySQLPass": "Q+JfrQS5DtSjqWHu1oO4HqctA2hVw4VhaDQfBCuvO8U="
  }
}
```

...or by saving them in uppercase environment variables prefixed by `CRYPTEX_SECRET_`:

```
CRYPTEX_SECRET_MYSQLPASS="Q+JfrQS5DtSjqWHu1oO4HqctA2hVw4VhaDQfBCuvO8U="
```

## API
First, grab an instance:

```javascript
var cryptex = require('cryptex');
```

##### new cryptex.Cryptex(opts = {})
Creates a new Cryptex instance with the specified options. See the `update` function
below for an option list.

##### cryptex.encrypt(data: string|Buffer, encoding = "utf8"): string
Encrypts the given data into a base64 string. If your string is binary data encoded
as base64 or hex, just pass `base64` or `hex` for the encoding. The encoding is ignored
if a Buffer is passed in.

##### cryptex.decrypt(data: string|Buffer, encoding = "base64"): string
Decrypts the given data and passes it back as utf8. If your string is binary data encoded
as base64 or hex, just pass `base64` or `hex` for the encoding. The encoding is ignored
if a Buffer is passed in.

##### cryptex.getSecret(secret: string): Promise<string>
Gets a Promise that resolves to a pre-saved secret, decrypted. See step 5 above.

##### cryptex.update(opts = {})
Updates the cryptex instance with new configuration. Available options are:

**file:** The path to a json file to load, mapping environments names (as pulled from
`$NODE_ENV`) to configuration objects. Can also be set in `CRYPTEX_FILE`. Defaults to
`cryptex.json` in the app process's current working directory.

**environment:** The environment to select from the specified json file. Cryptex will
attempt to pull an environment in this order: This value, the `CRYPTEX_ENVIRONMENT` env
var, the `NODE_ENV` env var, or default to `default` if all else has failed.

**cacheKey:** Boolean true to cache the key returned by the keySource in RAM, false to
pull the key from the source every time it's needed. Can also be set in
`CRYPTEX_CACHEKEY` with "true" or "false". _(Default: true)_

**cacheTimeout:** If cacheKey is true, the number of milliseconds after which to
delete the key and allow the Node.js garbage collector to remove it from RAM. Set to 0
to disable the timeout _(NOT RECOMMENDED)_. Can also be set in `CRYPTEX_CACHETIMEOUT`.
_(Default: 5000)_

**config:** A configuration object specifying the keySource and other information
outlined above. If this is set, Cryptex will not attempt to load a configuration file,
and the `environment` setting is ignored. Set config to `{}` to force all configuration
to be set in environment variables.

## Installation
Get it global and local for the super convenient command-line tool:

```
npm install -g cryptex
npm install --save cryptex
```

## Dependencies
Cryptex uses ES6 native Promises, available in Node.js version 0.12 and up. In order
to use the Amazon KMS retriever, the following is required:

```
npm install --save aws-sdk
```

This was not included in the Cryptex package.json to keep dependencies lean and mean
for folks who don't need that library.

## Security warning
The state of security in Javascript is abysmal at best. Node lends itself to far
better possibilities than what you'd find in the browser, but be aware of the following
types of attacks:

- Javascript modules that require('cryptex') or some other portion of your code,
overriding `getSecret` or other functions to steal your decrypted private data.
- Javascript modules that require('crypto') and monkey-patch the built-in Node library
to steal private data.
- Nefarious applications that dump the RAM from your Node process. Node's garbage
collector cannot be forced to run from Javascript, so even turning off the key cache
could expose a window in which an unencrypted key could be stolen.
- Applications, server users, or javascript modules that read local key files. When
in doubt, use Amazon KMS.

[This article by NCC Group](https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/august/javascript-cryptography-considered-harmful/)
is from 2011 and focuses on the security of Javascript in the browser, but is still
very much applicable today.  However, by using Amazon KMS, Cryptex, and with careful
review of all installed modules, a secure system in Node.js is possible.

## License
All original content is Copyright (c) 2015 TechnologyAdvice, released under
the ultra-permissive ISC license. See LICENSE.txt for details.
