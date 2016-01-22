var assert = require('assert');
var fs = require('fs');
var path = require('path');

var packageJSON = require('../../package.json');
var bowerJSON = require('../../bower.json');
var versionFile = fs.readFileSync(path.resolve(__dirname, '../../VERSION'), 'UTF-8');
var readMe = fs.readFileSync(path.resolve(__dirname, '../../README.md'), 'UTF-8');

describe('release should be consistent', function () {
  it('with a matching bower and npm module', function () {
    assert.equal(packageJSON.version, bowerJSON.version);
  });

  it('with have a matching VERSION', function () {
    assert.equal(versionFile, bowerJSON.version);
  });

  it('with bower valid entry point', function () {
    assert.equal(bowerJSON.main, 'dist/pubnub-angular-' + bowerJSON.version + '.min.js');
  });

  it('with packaged dist files', function () {
    var fileList = fs.readdirSync(path.resolve(__dirname, '../../dist'));
    assert.deepEqual(fileList, ['pubnub-angular-' + versionFile + '.js',
      'pubnub-angular-' + versionFile + '.min.js',
      'pubnub-angular-' + versionFile + '.min.js.map']);
  });

  it('with updated readme', function (){
    assert(readMe.indexOf('http://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-' + versionFile + '.js') > 1);
    assert(readMe.indexOf('https://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-' + versionFile + '.js') > 1);
    assert(readMe.indexOf('http://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-' + versionFile + '.min.js') > 1);
    assert(readMe.indexOf('https://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-' + versionFile + '.min.js') > 1);
  });

});