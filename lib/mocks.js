'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global angular */
module.exports = function () {
  function _class(label, service, $rootScope) {
    _classCallCheck(this, _class);

    this.label = label;
    this.$rootScope = $rootScope;
    this.service = service;
  }

  /**
   * Return allowed and enabled in args callbacks array
   *
   * @param {Object} argsValue from method call
   * @param {Array} initialCallbackNames from config object
   * @returns {Array} of callbacks to mock
   */

  _createClass(_class, [{
    key: 'getCallbacksToMock',
    value: function getCallbacksToMock(argsValue, initialCallbackNames) {
      var triggerEventsValue = argsValue.triggerEvents;
      var result = [];
      var length = undefined;
      var value = undefined;
      var i = undefined;

      if (triggerEventsValue === true) {
        return initialCallbackNames;
      } else if (angular.isObject(triggerEventsValue)) {
        length = triggerEventsValue.length;

        for (i = 0; i < length; i++) {
          value = triggerEventsValue[i];
          if (initialCallbackNames.indexOf(value) >= 0) result.push(value);
        }

        return result;
      } else {
        return [];
      }
    }

    /**
     * Mock passed in callbacks with callback-wrappers to invoke both original callbacks and angular events
     *
     * @param {string} instanceName
     * @param {string} methodName
     * @param {Object} object
     * @param {Array} callbacksList
     */

  }, {
    key: 'mockCallbacks',
    value: function mockCallbacks(instanceName, methodName, object, callbacksList) {
      var l = callbacksList.length;
      var originalCallbacks = {};
      var currentCallbackName = undefined;
      var $rootScope = this.$rootScope;
      var service = this.service;
      var i = undefined;

      for (i = 0; i < l; i++) {
        currentCallbackName = callbacksList[i];

        if (!angular.isObject(object)) {
          return;
        }

        originalCallbacks[currentCallbackName] = object[currentCallbackName];

        (function (callbackName) {
          object[currentCallbackName] = function () {
            $rootScope.$broadcast.bind.apply($rootScope.$broadcast, [$rootScope, service.getEventNameFor(methodName, callbackName, instanceName)].concat(Array.prototype.slice.call(arguments)))();

            if (callbackName in originalCallbacks && angular.isFunction(originalCallbacks[callbackName])) {
              originalCallbacks[callbackName].apply(null, arguments);
            }

            // REVIEW:
            if (methodName === 'subscribe') {
              switch (callbackName) {
                case 'callback':
                  $rootScope.$broadcast.bind.apply($rootScope.$broadcast, [$rootScope, service.getMessageEventNameFor(arguments[2], instanceName)].concat(Array.prototype.slice.call(arguments)))();
                  break;
                case 'presence':
                  $rootScope.$broadcast.bind.apply($rootScope.$broadcast, [$rootScope, service.getPresenceEventNameFor(arguments[2], instanceName)].concat(Array.prototype.slice.call(arguments)))();
                  break;
                default:
                  break;
              }
            }
          };
        })(currentCallbackName);
      }
    }
  }]);

  return _class;
}();
