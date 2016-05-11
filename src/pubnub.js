/* global angular PUBNUB */

const config = require('../config.json');
let Wrapper = require('./wrapper.js');

angular.module('pubnub.angular.service', [])
  .factory('Pubnub', ['$rootScope', function ($rootScope) {
    if (!angular.isDefined(PUBNUB)) {
      throw new Error('PUBNUB is not in global scope. Ensure that pubnub.js file is included before pubnub-angular.js');
    }

    let service = {};
    let wrappers = {};

    /**
     * Initializer for default instance
     *
     * @param {Object} initConfig
     */
    service.init = function (initConfig) {
      return service.getInstance(config.default_instance_name).init(initConfig);
    };

    /**
     * Instance getter
     *
     * @param instanceName
     * @returns {Wrapper}
     */
    service.getInstance = function (instanceName) {
      let instance = wrappers[instanceName];

      if (angular.isDefined(instance) && instance instanceof Wrapper) {
        return instance;
      } else if (typeof instanceName === 'string' && instanceName.length > 0) {
        wrappers[instanceName] = new Wrapper(instanceName, service, $rootScope);

        // register the methods in the new wrapper
        config.methods_to_delegate.forEach(method => {
          wrappers[instanceName].wrapMethod(method);

          service[method] = function (args) {
            return this.getInstance(config.default_instance_name)[method](args);
          };
        });

        return wrappers[instanceName];
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
      if (!instanceName) instanceName = config.default_instance_name;

      return [config.pubnub_prefix, instanceName, methodName, callbackName].join(':');
    };

    /**
     * Generate unique message event name for specified channel
     *
     * @param {string} channelName
     * @param {string} instanceName
     * @returns {string} event name
     */
    service.getMessageEventNameFor = function (channelName, instanceName) {
      if (!instanceName) instanceName = config.default_instance_name;

      return [config.pubnub_prefix, instanceName, 'subscribe', 'callback', channelName].join(':');
    };

    /**
     * Generate unique presence event name for specified channel
     *
     * @param {string} channelName
     * @param {string} instanceName
     * @returns {string} event name
     */
    service.getPresenceEventNameFor = function (channelName, instanceName) {
      if (!instanceName) instanceName = config.default_instance_name;

      return [config.pubnub_prefix, instanceName, 'subscribe', 'presence', channelName].join(':');
    };

    /**
     * Subscribe method wrapper for default instance
     *
     * @param {object} args
     */
    service.subscribe = function (args) {
      this.getInstance(config.default_instance_name).subscribe(args);
    };

    return service;
  }]);
