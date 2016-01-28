/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* global angular PUBNUB */

	var config = __webpack_require__(1);
	var Wrapper = __webpack_require__(2);

	angular.module('pubnub.angular.service', []).factory('Pubnub', ['$rootScope', function ($rootScope) {
	  if (!angular.isDefined(PUBNUB)) {
	    throw new Error('PUBNUB is not in global scope. Ensure that pubnub.js file is included before pubnub-angular.js');
	  }

	  var service = {};
	  var wrappers = {};

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
	    var instance = wrappers[instanceName];

	    if (angular.isDefined(instance) && instance instanceof Wrapper) {
	      return instance;
	    } else if (typeof instanceName === 'string' && instanceName.length > 0) {
	      wrappers[instanceName] = new Wrapper(instanceName, service, $rootScope);

	      // register the methods in the new wrapper
	      config.methods_to_delegate.forEach(function (method) {
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

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = {
		"pubnub_prefix": "pubnub",
		"default_instance_name": "default",
		"methods_to_delegate": [
			"history",
			"replay",
			"publish",
			"unsubscribe",
			"here_now",
			"grant",
			"revoke",
			"audit",
			"time",
			"where_now",
			"state",
			"channel_group",
			"channel_group_list_channels",
			"channel_group_list_groups",
			"channel_group_list_namespaces",
			"channel_group_remove_channel",
			"channel_group_remove_group",
			"channel_group_remove_namespace",
			"channel_group_add_channel",
			"channel_group_cloak",
			"set_uuid",
			"get_uuid",
			"uuid",
			"auth",
			"set_cipher_key",
			"get_cipher_key",
			"raw_encrypt",
			"raw_decrypt",
			"set_heartbeat",
			"get_heartbeat",
			"set_heartbeat_interval",
			"get_heartbeat_interval",
			"mobile_gw_provision"
		],
		"common_callbacks_to_wrap": [
			"callback",
			"error"
		],
		"subscribe_callbacks_to_wrap": [
			"callback",
			"connect",
			"reconnect",
			"disconnect",
			"error",
			"idle",
			"presence"
		]
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/* global angular PUBNUB */

	var config = __webpack_require__(1);
	var Mocks = __webpack_require__(3);

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

/***/ },
/* 3 */
/***/ function(module, exports) {

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

/***/ }
/******/ ]);