/* global angular */

const config = require('../config.common.json');

module.exports = class {
  /**
  * Constructor
  * The constructor is called through this way $pubnubChannel(channelName, options) and shoudld rarely called directely
  * @param {String} label: instance name
  * @param {Hash} service: PubNub Angular service composed of functions
  * @param {$rootScope} $rootScope : the $rootScope of the PubNub Angular service
  * @param {Hash} $rootScope : the $rootScope of the PubNub Angular service
  * @constructor
  */
  constructor(label, service, $rootScope, wrapperConfig) {
    this.label = label;
    this.mockingInstance = null;
    this.pubnubInstance = null;

    // Register the methods in the wrapper and replace callbacks by mocked callbacks if needed
    wrapperConfig.methods_to_wrap.forEach(method => {
      this.wrapMethod(method);

      // Add the wrapped method to the service
      service[method] = function (args, callbackFunction) {
        return this.getInstance(config.default_instance_name)[method](args, callbackFunction);
      };
    });

    // Just delegate the methods to the wrapper
    wrapperConfig.methods_to_delegate.forEach(method => {
      this[method] = (args) => this.getOriginalInstance()[method](args);
      // Add the delegated method to the service
      service[method] = function (args) {
        return this.getInstance(config.default_instance_name)[method](args);
      };
    });
  }

  /**
  * This method returns the label of the wrapper which is the name of the instance.
  **/
  getLabel() {
    return this.label;
  }

  /**
  * This method returns the original PubNub instance associated with this wrapper
  **/
  getOriginalInstance() {
    if (this.pubnubInstance) {
      return this.pubnubInstance;
    } else {
      throw new ReferenceError('Pubnub default instance is not initialized yet. Invoke #init() method first.');
    }
  }

};
