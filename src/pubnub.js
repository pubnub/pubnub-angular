/* global angular PUBNUB */
/* global angular PubNub */

const commonConfig = require('../config.common.json');

let Wrapper = require('./wrapper.js');
let WrapperPubNubV3 = require('./v3/wrapper_pubnub_v3.js');
let WrapperPubNubV4 = require('./v4/wrapper_pubnub_v4.js');

angular.module('pubnub.angular.service', [])
  .factory('Pubnub', ['$rootScope', function ($rootScope) {
    if (typeof PUBNUB === 'undefined' && typeof PubNub === 'undefined') {
      throw new Error('PUBNUB is not in global scope. Ensure that pubnub.js file is included before pubnub-angular.js');
    }

    let service = {};
    let instances = {};
    /**
     * Return the version of PubNub used by the PubNub service.
     *
     * @param {Object} initConfig
     */
    service.getPubNubVersion = function () {
      return (typeof PUBNUB === 'undefined') ? '4' : '3';
    };

    /**
     * Initializer for default instance
     *
     * @param {Object} initConfig
     */
    service.init = function (initConfig) {
      return service.getInstance(commonConfig.default_instance_name).init(initConfig);
    };

    /**
     * Instance getter
     *
     * @param instanceName
     * @returns {Wrapper}
     */
    service.getInstance = function (instanceName) {
      let instance = instances[instanceName];

      if (angular.isDefined(instance) && instance instanceof Wrapper) {
        return instance;
      } else if (typeof instanceName === 'string' && instanceName.length > 0) {
        if (this.getPubNubVersion() === '3') {
          instances[instanceName] = new WrapperPubNubV3(instanceName, service, $rootScope);
        } else if (this.getPubNubVersion() === '4') {
          instances[instanceName] = new WrapperPubNubV4(instanceName, service, $rootScope);
        }

        return instances[instanceName];
      }

      return instance;
    };

    /**
     * Generate unique method/callback event name
     *
     * @param {string} methodName
     * @param {string} callbackName
     * @param {string} instanceName
     * @returns {string} event name
     */
    service.getEventNameFor = function (methodName, callbackName, instanceName) {
      if (!instanceName) instanceName = commonConfig.default_instance_name;

      return [commonConfig.pubnub_prefix, instanceName, methodName, callbackName].join(':');
    };

    /**
     * Generate unique message event name for specified channel
     *
     * @param {string} channelName
     * @param {string} instanceName
     * @returns {string} event name
     */
    service.getMessageEventNameFor = function (channelName, instanceName) {
      if (!instanceName) instanceName = commonConfig.default_instance_name;

      return [commonConfig.pubnub_prefix, instanceName, 'subscribe', 'callback', channelName].join(':');
    };

    /**
     * Generate unique presence event name for specified channel
     *
     * @param {string} channelName
     * @param {string} instanceName
     * @returns {string} event name
     */
    service.getPresenceEventNameFor = function (channelName, instanceName) {
      if (!instanceName) instanceName = commonConfig.default_instance_name;

      return [commonConfig.pubnub_prefix, instanceName, 'subscribe', 'presence', channelName].join(':');
    };

    /**
     * Subscribe method wrapper for default instance
     *
     * @param {object} args
     */
    service.subscribe = function (args) {
      this.getInstance(commonConfig.default_instance_name).subscribe(args);
    };

    return service;
  }]);
