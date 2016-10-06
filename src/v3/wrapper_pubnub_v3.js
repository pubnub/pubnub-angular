/* global angular PUBNUB */

let Wrapper = require('../wrapper.js');
let MockV3 = require('./mock_v3.js');
const configPubNubV3 = require('./config.pubnub-v3.json');

module.exports = class extends Wrapper {

  constructor(label, service, $rootScope) {
    super(label, service, $rootScope, configPubNubV3);
    this.mockingInstance = new MockV3(label, service, $rootScope);
  }

  init(initConfig) {
    this.pubnubInstance = new PUBNUB(initConfig);
  }

  subscribe(args) {
    let callbacks = this.mockingInstance.getCallbacksToMock(args, configPubNubV3.subscribe_callbacks_to_wrap);
    this.mockingInstance.mockCallbacks(this.getLabel(), 'subscribe', args, callbacks);
    this.getOriginalInstance().subscribe(args);
  }

  /**
  * This method add to the Wrapper the original PubNub method overrided with event broadcast if needed.
  **/
  wrapMethod(methodName) {
    this[methodName] = (args) => {
      if (angular.isObject(args)) {
        let callbacks = this.mockingInstance.getCallbacksToMock(args, configPubNubV3.common_callbacks_to_wrap);
        this.mockingInstance.mockCallbacks(this.getLabel(), methodName, args, callbacks);
      }

      return this.getOriginalInstance()[methodName](args);
    };
  }

};
