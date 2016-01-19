'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global angular PUBNUB */

var config = require('../config.json');
var Mocks = require('./mocks.js');

module.exports = function () {
  function _class(label, service, $rootScope) {
    _classCallCheck(this, _class);

    this.label = label;
    this.mockingInstance = new Mocks(label, service, $rootScope);
    this.pubnubInstance = null;
  }

  _createClass(_class, [{
    key: 'init',
    value: function init(initConfig) {
      this.pubnubInstance = new PUBNUB.init(initConfig);
    }
  }, {
    key: 'getLabel',
    value: function getLabel() {
      return this.label;
    }
  }, {
    key: 'subscribe',
    value: function subscribe(args) {
      var callbacks = this.mockingInstance.getCallbacksToMock(args, config.subscribe_callbacks_to_wrap);
      this.mockingInstance.mockCallbacks(this.getLabel(), 'subscribe', args, callbacks);

      this.getOriginalInstance().subscribe(args);
    }
  }, {
    key: 'getOriginalInstance',
    value: function getOriginalInstance() {
      if (this.pubnubInstance) {
        return this.pubnubInstance;
      } else {
        throw new ReferenceError('Pubnub default instance is not initialized yet. Invoke #init() method first.');
      }
    }
  }, {
    key: 'wrapMethod',
    value: function wrapMethod(methodName) {
      var _this = this;

      this[methodName] = function (args) {
        if (angular.isObject(args)) {
          var callbacks = _this.mockingInstance.getCallbacksToMock(args, config.common_callbacks_to_wrap);
          _this.mockingInstance.mockCallbacks(_this.getLabel(), methodName, args, callbacks);
        }

        return _this.getOriginalInstance()[methodName](args);
      };
    }
  }]);

  return _class;
}();
