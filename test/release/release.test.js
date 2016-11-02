/* global describe, it, __dirname */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const packageJSON = require('../../package.json');
const bowerJSON = require('../../bower.json');

const readMe = fs.readFileSync(path.resolve(__dirname, '../../README.md'), 'UTF-8');

describe('release should be consistent', () => {
  it('with a matching bower and npm module', () => {
    assert.equal(packageJSON.version, bowerJSON.version);
  });

  it('with bower valid entry point', () => {
    assert.equal(bowerJSON.main, 'dist/pubnub-angular.min.js');
  });

  it('with npm valid entry point', () => {
    assert.equal(packageJSON.main, 'dist/pubnub-angular.min.js');
  });

  it('with packaged dist files', () => {
    const fileList = fs.readdirSync(path.resolve(__dirname, '../../dist'));
    assert.deepEqual(fileList, [
      'pubnub-angular.js',
      'pubnub-angular.min.js',
      'pubnub-angular.min.js.map',
    ]);
  });

  it('with updated readme', () => {
    assert(readMe.indexOf('http(s)://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-' + packageJSON.version + '.js') > 1);
    assert(readMe.indexOf('http(s)://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-' + packageJSON.version + '.min.js') > 1);
  });
});
