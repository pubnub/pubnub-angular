/* global angular PubNub */

let Wrapper = require('../wrapper.js');
let MockV4 = require('./mock_v4.js');
let SubscribeEventsBroadcaster = require('./subscribe_events_broadcaster.js');
const configPubNubV4 = require('./config.pubnub-v4.json');


module.exports = class extends Wrapper {

  constructor(label, service, $rootScope) {
    super(label, service, $rootScope, configPubNubV4);
    this.mockingInstance = new MockV4(label, service, $rootScope);
    this.subscribeEventsBroadcaster = new SubscribeEventsBroadcaster(label, service, $rootScope, this);
  }

  init(initConfig) {
    this.pubnubInstance = new PubNub(initConfig);
  }

  subscribe(args) {
    // Events to trigger [message, presence, status]
    let eventsToBroadcast = this.mockingInstance.getCallbacksToMock(args, configPubNubV4.subscribe_listener_events_to_broadcast);
    this.subscribeEventsBroadcaster.enableEventsBroadcast(eventsToBroadcast, args);
    this.getOriginalInstance().subscribe(args);
  }

  /**
  * This method add to the Wrapper the original PubNub method overrided with event broadcast if needed.
  **/
  wrapMethod(methodName) {
    this[methodName] = (args, callbackFunction) => {
      if (angular.isObject(args)) {
        let callbacks = this.mockingInstance.getCallbacksToMock(args, configPubNubV4.common_callbacks_to_wrap);
        // Mock the callback to trigger events
        if (callbacks.length > 0) {
          callbackFunction = this.mockingInstance.generateMockedVersionOfCallback(callbackFunction, 'callback', methodName, this.getLabel());
        }
      }

      return this.getOriginalInstance()[methodName](args, callbackFunction);
    };
  }

};
