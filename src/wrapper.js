/* global angular PUBNUB */

const config = require('../config.json');
let Mocks = require('./mocks.js');

module.exports = class {
  constructor(label, service, $rootScope) {
    this.label = label;
    this.mockingInstance = new Mocks(label, service, $rootScope);
    this.pubnubInstance = null;
  }

  init(initConfig) {
    this.pubnubInstance = new PUBNUB.init(initConfig);
  }

  getLabel() {
    return this.label;
  }

  subscribe(args) {
    let callbacks = this.mockingInstance.getCallbacksToMock(args, config.subscribe_callbacks_to_wrap);
    this.mockingInstance.mockCallbacks(this.getLabel(), 'subscribe', args, callbacks);

    this.getOriginalInstance().subscribe(args);
  }

  getOriginalInstance() {
    if (this.pubnubInstance) {
      return this.pubnubInstance;
    } else {
      throw new ReferenceError('Pubnub default instance is not initialized yet. Invoke #init() method first.');
    }
  }

  wrapMethod(methodName) {
    this[methodName] = (args) => {
      if (angular.isObject(args)) {
        let callbacks = this.mockingInstance.getCallbacksToMock(args, config.common_callbacks_to_wrap);
        this.mockingInstance.mockCallbacks(this.getLabel(), methodName, args, callbacks);
      }

      return this.getOriginalInstance()[methodName](args);
    };
  }
};
