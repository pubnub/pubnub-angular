/* global describe, it, __dirname */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const packageJSON = require('../../package.json');
const bowerJSON = require('../../bower.json');
const versionFile = fs.readFileSync(path.resolve(__dirname, '../../VERSION'), 'UTF-8');
const readMe = fs.readFileSync(path.resolve(__dirname, '../../README.md'), 'UTF-8');

describe('release should be consistent', () => {
  it('with a matching bower and npm module', () => {
    assert.equal(packageJSON.version, bowerJSON.version);
  });

  it('with have a matching VERSION', () => {
    assert.equal(versionFile, bowerJSON.version);
  });

  it('with bower valid entry point', () => {
    assert.equal(bowerJSON.main, 'dist/pubnub-angular-' + bowerJSON.version + '.min.js');
  });

  it('with npm valid entry point', () => {
    assert.equal(packageJSON.main, 'dist/pubnub-angular-' + packageJSON.version + '.min.js');
  });

  it('with packaged dist files', () => {
    const fileList = fs.readdirSync(path.resolve(__dirname, '../../dist'));
    assert.deepEqual(fileList, ['pubnub-angular-' + versionFile + '.js',
      'pubnub-angular-' + versionFile + '.min.js',
      'pubnub-angular-' + versionFile + '.min.js.map']);
  });

  it('with updated readme', () => {
    assert(readMe.indexOf('http(s)://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-' + versionFile + '.js') > 1);
    assert(readMe.indexOf('http(s)://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-' + versionFile + '.min.js') > 1);
  });
});
