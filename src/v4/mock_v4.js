/* global angular */
let Mock = require('../mock.js');

module.exports = class extends Mock {

  /**
   * Returns a mocked version of the given callback broadcasting the callback through
   * the AngularJS event broadcasting mechanism.
   *
   * @param {function} originalCallback
   * @param {string} callbackName
   * @param {string} methodName
   * @param {string} instanceName
   * @return {Function} mocked callback function broadcasting angular events on the rootScope
   */

  generateMockedVersionOfCallback(originalCallback, callbackName, methodName, instanceName) {
    let $rootScope = this.$rootScope;
    let service = this.service;

    return function () {
      // Broadcast through the generic event name
      $rootScope.$broadcast.bind(...[$rootScope, service.getEventNameFor(methodName, callbackName, instanceName)]
                                    .concat(Array.prototype.slice.call(arguments))
                                 )();

      // Call the original callback
      if (callbackName && angular.isFunction(originalCallback)) {
        originalCallback(...arguments);
      }
    };
  }
};
