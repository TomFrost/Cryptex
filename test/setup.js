/*
 * Copyright (c) 2017 Tom Shawver
 */

'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const path = require('path')
const mod = require('module')
const sinon = require('sinon')

chai.use(chaiAsPromised)
global.should = chai.should()
global.sinon = sinon

// importing files with ../../../../../.. makes my brain hurt
process.env.NODE_PATH = path.join(__dirname, '..') + path.delimiter + (process.env.NODE_PATH || '')
mod._initPaths()
