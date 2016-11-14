/*! 4.0.2 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(13);
	__webpack_require__(14);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	/* eslint-disable */
	/* istanbul ignore next */
	// Object.create(proto[, propertiesObject])
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
	if (typeof Object.create !== 'function') {
	  Object.create = function () {
	    var Temp = function Temp() {};
	    return function (prototype) {
	      if (arguments.length > 1) {
	        throw new Error('Second argument not supported');
	      }
	      if (prototype !== Object(prototype) && prototype !== null) {
	        throw new TypeError('Argument must be an object or null');
	      }
	      if (prototype === null) {
	        throw Error('null [[Prototype]] not supported');
	      }
	      Temp.prototype = prototype;
	      var result = new Temp();
	      Temp.prototype = null;
	      return result;
	    };
	  }();
	}
	/* istanbul ignore next */
	// Production steps of ECMA-262, Edition 5, 15.4.4.19
	// Reference: http://es5.github.io/#x15.4.4.19
	if (!Array.prototype.map) {
	  Array.prototype.map = function (callback, thisArg) {
	    var T, A, k;
	    if (this == null) {
	      throw new TypeError(' this is null or not defined');
	    }
	    // 1. Let O be the result of calling ToObject passing the |this| 
	    //    value as the argument.
	    var O = Object(this);
	    // 2. Let lenValue be the result of calling the Get internal 
	    //    method of O with the argument "length".
	    // 3. Let len be ToUint32(lenValue).
	    var len = O.length >>> 0;
	    // 4. If IsCallable(callback) is false, throw a TypeError exception.
	    // See: http://es5.github.com/#x9.11
	    if (typeof callback !== 'function') {
	      throw new TypeError(callback + ' is not a function');
	    }
	    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
	    if (arguments.length > 1) {
	      T = thisArg;
	    }
	    // 6. Let A be a new array created as if by the expression new Array(len) 
	    //    where Array is the standard built-in constructor with that name and 
	    //    len is the value of len.
	    A = new Array(len);
	    // 7. Let k be 0
	    k = 0;
	    // 8. Repeat, while k < len
	    while (k < len) {
	      var kValue, mappedValue;
	      // a. Let Pk be ToString(k).
	      //   This is implicit for LHS operands of the in operator
	      // b. Let kPresent be the result of calling the HasProperty internal 
	      //    method of O with argument Pk.
	      //   This step can be combined with c
	      // c. If kPresent is true, then
	      if (k in O) {
	        // i. Let kValue be the result of calling the Get internal 
	        //    method of O with argument Pk.
	        kValue = O[k];
	        // ii. Let mappedValue be the result of calling the Call internal 
	        //     method of callback with T as the this value and argument 
	        //     list containing kValue, k, and O.
	        mappedValue = callback.call(T, kValue, k, O);
	        // iii. Call the DefineOwnProperty internal method of A with arguments
	        // Pk, Property Descriptor
	        // { Value: mappedValue,
	        //   Writable: true,
	        //   Enumerable: true,
	        //   Configurable: true },
	        // and false.
	        // In browsers that support Object.defineProperty, use the following:
	        // Object.defineProperty(A, k, {
	        //   value: mappedValue,
	        //   writable: true,
	        //   enumerable: true,
	        //   configurable: true
	        // });
	        // For best browser support, use the following:
	        A[k] = mappedValue;
	      }
	      // d. Increase k by 1.
	      k++;
	    }
	    // 9. return A
	    return A;
	  };
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* global angular PUBNUB */
	/* global angular PubNub */
	
	var commonConfig = __webpack_require__(3);
	
	var Wrapper = __webpack_require__(4);
	var WrapperPubNubV3 = __webpack_require__(5);
	var WrapperPubNubV4 = __webpack_require__(9);
	
	angular.module('pubnub.angular.service', []).factory('Pubnub', ['$rootScope', function ($rootScope) {
	  if (typeof PUBNUB === 'undefined' && typeof PubNub === 'undefined') {
	    throw new Error('PUBNUB is not in global scope. Ensure that pubnub.js file is included before pubnub-angular.js');
	  }
	
	  var service = {};
	  var instances = {};
	  /**
	   * Return the version of PubNub used by the PubNub service.
	   *
	   * @param {Object} initConfig
	   */
	  service.getPubNubVersion = function () {
	    return typeof PUBNUB === 'undefined' ? '4' : '3';
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
	    var instance = instances[instanceName];
	
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
	  service.getEventNameFor = function (methodName, callbackName) {
	    var instanceName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : commonConfig.default_instance_name;
	
	    return [commonConfig.pubnub_prefix, instanceName, methodName, callbackName].join(':');
	  };
	
	  /**
	   * Generate unique message event name for specified channel
	   *
	   * @param {string} channelName
	   * @param {string} instanceName
	   * @returns {string} event name
	   */
	  service.getMessageEventNameFor = function (channelName) {
	    var instanceName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : commonConfig.default_instance_name;
	
	    return [commonConfig.pubnub_prefix, instanceName, 'subscribe', 'callback', channelName].join(':');
	  };
	
	  /**
	   * Generate unique presence event name for specified channel
	   *
	   * @param {string} channelName
	   * @param {string} instanceName
	   * @returns {string} event name
	   */
	  service.getPresenceEventNameFor = function (channelName) {
	    var instanceName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : commonConfig.default_instance_name;
	
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
		"pubnub_prefix": "pubnub",
		"default_instance_name": "default"
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* global angular */
	/* eslint no-param-reassign: 0 */
	var config = __webpack_require__(3);
	
	module.exports = function () {
	  /**
	  * Constructor
	  * The constructor is called through this way $pubnubChannel(channelName, options) and shoudld rarely called directely
	  * @param {String} label: instance name
	  * @param {Hash} service: PubNub Angular service composed of functions
	  * @param {$rootScope} $rootScope : the $rootScope of the PubNub Angular service
	  * @param {Hash} $rootScope : the $rootScope of the PubNub Angular service
	  * @constructor
	  */
	  function _class(label, service, $rootScope, wrapperConfig) {
	    var _this = this;
	
	    _classCallCheck(this, _class);
	
	    this.label = label;
	    this.mockingInstance = null;
	    this.pubnubInstance = null;
	    // Register the methods in the wrapper and replace callbacks by mocked callbacks if needed
	    wrapperConfig.methods_to_wrap.forEach(function (method) {
	      if (angular.isObject(method)) {
	        (function () {
	          var methodGroup = Object.keys(method)[0];
	          var methodList = method[methodGroup];
	          _this[methodGroup] = {};
	          service[methodGroup] = {};
	          methodList.forEach(function (m) {
	            _this.wrapMethod(m, methodGroup);
	            service[methodGroup][m] = function (args, callbackFunction) {
	              return service.getInstance(config.default_instance_name)[methodGroup][m](args, callbackFunction);
	            };
	          });
	        })();
	      } else {
	        _this.wrapMethod(method);
	        // Add the wrapped method to the service
	        service[method] = function (args, callbackFunction) {
	          return service.getInstance(config.default_instance_name)[method](args, callbackFunction);
	        };
	      }
	    });
	
	    // Just delegate the methods to the wrapper
	    wrapperConfig.methods_to_delegate.forEach(function (method) {
	      _this[method] = function (args) {
	        return _this.getOriginalInstance()[method](args);
	      };
	      // Add the delegated method to the service
	      service[method] = function (args) {
	        return this.getInstance(config.default_instance_name)[method](args);
	      };
	    });
	  }
	
	  /**
	  * This method returns the label of the wrapper which is the name of the instance.
	  **/
	
	
	  _createClass(_class, [{
	    key: 'getLabel',
	    value: function getLabel() {
	      return this.label;
	    }
	
	    /**
	    * This method returns the original PubNub instance associated with this wrapper
	    **/
	
	  }, {
	    key: 'getOriginalInstance',
	    value: function getOriginalInstance() {
	      if (this.pubnubInstance) {
	        return this.pubnubInstance;
	      } else {
	        throw new ReferenceError('Pubnub default instance is not initialized yet. Invoke #init() method first.');
	      }
	    }
	  }]);
	
	  return _class;
	}();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/* global angular PUBNUB */
	
	var Wrapper = __webpack_require__(4);
	var MockV3 = __webpack_require__(6);
	var configPubNubV3 = __webpack_require__(8);
	
	module.exports = function (_Wrapper) {
	  _inherits(_class, _Wrapper);
	
	  function _class(label, service, $rootScope) {
	    _classCallCheck(this, _class);
	
	    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, label, service, $rootScope, configPubNubV3));
	
	    _this.mockingInstance = new MockV3(label, service, $rootScope);
	    return _this;
	  }
	
	  _createClass(_class, [{
	    key: 'init',
	    value: function init(initConfig) {
	      this.pubnubInstance = new PUBNUB(initConfig);
	    }
	  }, {
	    key: 'subscribe',
	    value: function subscribe(args) {
	      var callbacks = this.mockingInstance.getCallbacksToMock(args, configPubNubV3.subscribe_callbacks_to_wrap);
	      this.mockingInstance.mockCallbacks(this.getLabel(), 'subscribe', args, callbacks);
	      this.getOriginalInstance().subscribe(args);
	    }
	
	    /**
	    * This method add to the Wrapper the original PubNub method overrided with event broadcast if needed.
	    **/
	
	  }, {
	    key: 'wrapMethod',
	    value: function wrapMethod(methodName) {
	      var _this2 = this;
	
	      this[methodName] = function (args) {
	        if (angular.isObject(args)) {
	          var callbacks = _this2.mockingInstance.getCallbacksToMock(args, configPubNubV3.common_callbacks_to_wrap);
	          _this2.mockingInstance.mockCallbacks(_this2.getLabel(), methodName, args, callbacks);
	        }
	
	        return _this2.getOriginalInstance()[methodName](args);
	      };
	    }
	  }]);
	
	  return _class;
	}(Wrapper);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/* global angular */
	/* eslint no-param-reassign: 0 */
	var Mock = __webpack_require__(7);
	
	module.exports = function (_Mock) {
	  _inherits(_class, _Mock);
	
	  function _class() {
	    _classCallCheck(this, _class);
	
	    return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
	  }
	
	  _createClass(_class, [{
	    key: 'generateMockedVersionOfCallback',
	
	
	    /**
	     * Returns a mocked version of the given callback broadcasting the callback through
	     * the AngularJS event broadcasting mechanism.
	     *
	     * @param {function} originalCallback
	     * @param {string} callbackName
	     * @param {string} methodName
	     * @param {string} instanceName
	     * @param {string} methodArguments: the arguments of the method that setup the callback
	     * @return {Function} mocked callback function broadcasting angular events on the rootScope
	     */
	
	    value: function generateMockedVersionOfCallback(originalCallback, callbackName, methodName, instanceName, methodArguments) {
	      var $rootScope = this.$rootScope;
	      var service = this.service;
	      var channelName = methodArguments.channel || methodArguments.channel_group;
	
	      return function () {
	        var _$rootScope$$broadcas, _$rootScope$$broadcas2, _$rootScope$$broadcas3;
	
	        // Broadcast through the generic event name
	        (_$rootScope$$broadcas = $rootScope.$broadcast).bind.apply(_$rootScope$$broadcas, _toConsumableArray([$rootScope, service.getEventNameFor(methodName, callbackName, instanceName)].concat(Array.prototype.slice.call(arguments))))();
	
	        // Call the original callback
	        if (callbackName && angular.isFunction(originalCallback)) {
	          originalCallback.apply(undefined, arguments);
	        }
	
	        // Broadcast through the message event or presence event
	        if (methodName === 'subscribe') {
	          switch (callbackName) {
	            case 'callback':
	              (_$rootScope$$broadcas2 = $rootScope.$broadcast).bind.apply(_$rootScope$$broadcas2, _toConsumableArray([$rootScope, service.getMessageEventNameFor(channelName, instanceName)].concat(Array.prototype.slice.call(arguments))))();
	              break;
	            case 'presence':
	              (_$rootScope$$broadcas3 = $rootScope.$broadcast).bind.apply(_$rootScope$$broadcas3, _toConsumableArray([$rootScope, service.getPresenceEventNameFor(channelName, instanceName)].concat(Array.prototype.slice.call(arguments))))();
	              break;
	            default:
	              break;
	          }
	        }
	      };
	    }
	
	    /**
	     * Mock passed in callbacks with callback-wrappers to invoke both original callbacks and angular events
	     *
	     * This method is replacing from the list of arguments {{args}} the callbacks functions
	     * allowed and enabled to be mocked provided by the {{callbackList}} by new callbacks functions
	     * including the Angular event broadcasting
	     *
	     * @param {string} instanceName
	     * @param {string} methodName
	     * @param {Object} methodArguments : argument list of the function
	     * @param {Array} callbacksList : list of callbacks functions to be mocked
	     */
	
	  }, {
	    key: 'mockCallbacks',
	    value: function mockCallbacks(instanceName, methodName, methodArguments, callbacksList) {
	      var originalCallback = void 0;
	      var currentCallbackName = void 0;
	
	      var l = callbacksList.length;
	      var i = void 0;
	
	      // Replace each callbacks allowed to be mocked.
	      for (i = 0; i < l; i += 1) {
	        if (!angular.isObject(methodArguments)) {
	          return;
	        }
	
	        currentCallbackName = callbacksList[i];
	        originalCallback = methodArguments[currentCallbackName];
	
	        // We replace the original callback with a mocked version.
	        methodArguments[currentCallbackName] = this.generateMockedVersionOfCallback(originalCallback, currentCallbackName, methodName, instanceName, methodArguments);
	      }
	    }
	  }]);
	
	  return _class;
	}(Mock);

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
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
	   * Return the list of callbacks names allowed and enabled to be mocked.
	   *
	   * This methods given a list of callbacks names {{initialCallbackNames}} and the argument list
	   * of the function {{argsValue}} will return the list of callbacks names that can be mocked.
	   * This method is usefull for the {{mockCallbacks}} method in order to know which callback functions to mock.
	   *
	   * @param {Object} argsValue from method call
	   * @param {Array} initialCallbackNames from config object
	   * @returns {Array} of callbacks to mock
	   */
	
	
	  _createClass(_class, [{
	    key: "getCallbacksToMock",
	    value: function getCallbacksToMock(argsValue, initialCallbackNames) {
	      var triggerEventsValue = argsValue.triggerEvents;
	      var result = [];
	      var length = void 0;
	      var value = void 0;
	      var i = void 0;
	
	      if (triggerEventsValue === true) {
	        return initialCallbackNames;
	      } else if (angular.isObject(triggerEventsValue)) {
	        length = triggerEventsValue.length;
	
	        for (i = 0; i < length; i += 1) {
	          value = triggerEventsValue[i];
	          if (initialCallbackNames.indexOf(value) >= 0) result.push(value);
	        }
	
	        return result;
	      } else {
	        return [];
	      }
	    }
	  }]);
	
	  return _class;
	}();

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = {
		"methods_to_delegate": [
			"replay",
			"unsubscribe",
			"revoke",
			"audit",
			"time",
			"channel_group",
			"channel_group_list_groups",
			"channel_group_list_namespaces",
			"channel_group_remove_namespace",
			"channel_group_cloak",
			"get_subscribed_channels",
			"set_uuid",
			"get_uuid",
			"auth",
			"set_cipher_key",
			"get_cipher_key",
			"raw_encrypt",
			"raw_decrypt",
			"set_heartbeat",
			"get_heartbeat",
			"set_heartbeat_interval",
			"get_heartbeat_interval"
		],
		"methods_to_wrap": [
			"here_now",
			"history",
			"publish",
			"fire",
			"here_now",
			"where_now",
			"state",
			"grant",
			"revoke",
			"channel_group_add_channel",
			"channel_group_list_channels",
			"channel_group_remove_channel",
			"channel_group_remove_group",
			"mobile_gw_provision"
		],
		"subscribe_callbacks_to_wrap": [
			"callback",
			"connect",
			"reconnect",
			"disconnect",
			"error",
			"idle",
			"presence"
		],
		"common_callbacks_to_wrap": [
			"callback",
			"error"
		]
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/* global angular PubNub */
	/* eslint no-param-reassign: 0 */
	
	var Wrapper = __webpack_require__(4);
	var MockV4 = __webpack_require__(10);
	var SubscribeEventsBroadcaster = __webpack_require__(11);
	var configPubNubV4 = __webpack_require__(12);
	
	module.exports = function (_Wrapper) {
	  _inherits(_class, _Wrapper);
	
	  function _class(label, service, $rootScope) {
	    _classCallCheck(this, _class);
	
	    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, label, service, $rootScope, configPubNubV4));
	
	    _this.mockingInstance = new MockV4(label, service, $rootScope);
	    _this.subscribeEventsBroadcaster = new SubscribeEventsBroadcaster(label, service, $rootScope, _this);
	    return _this;
	  }
	
	  _createClass(_class, [{
	    key: 'init',
	    value: function init(initConfig) {
	      this.pubnubInstance = new PubNub(initConfig);
	    }
	  }, {
	    key: 'subscribe',
	    value: function subscribe(args) {
	      // Events to trigger [message, presence, status]
	      var eventsToBroadcast = this.mockingInstance.getCallbacksToMock(args, configPubNubV4.subscribe_listener_events_to_broadcast);
	      this.subscribeEventsBroadcaster.enableEventsBroadcast(eventsToBroadcast, args);
	      this.getOriginalInstance().subscribe(args);
	    }
	
	    /**
	    * This method add to the Wrapper the original PubNub method overrided with event broadcast if needed.
	    **/
	
	  }, {
	    key: 'wrapMethod',
	    value: function wrapMethod(methodName, methodGroup) {
	      var _this2 = this;
	
	      if (methodGroup !== undefined) {
	        this[methodGroup][methodName] = function (args, callbackFunction) {
	          if (angular.isObject(args)) {
	            var callbacks = _this2.mockingInstance.getCallbacksToMock(args, configPubNubV4.common_callbacks_to_wrap);
	            // Mock the callback to trigger events
	            if (callbacks.length > 0) {
	              var eventName = methodGroup + '.' + methodName;
	              callbackFunction = _this2.mockingInstance.generateMockedVersionOfCallback(callbackFunction, 'callback', eventName, _this2.getLabel());
	            }
	          }
	          return _this2.getOriginalInstance()[methodGroup][methodName](args, callbackFunction);
	        };
	      } else {
	        this[methodName] = function (args, callbackFunction) {
	          if (angular.isObject(args)) {
	            var callbacks = _this2.mockingInstance.getCallbacksToMock(args, configPubNubV4.common_callbacks_to_wrap);
	            // Mock the callback to trigger events
	            if (callbacks.length > 0) {
	              callbackFunction = _this2.mockingInstance.generateMockedVersionOfCallback(callbackFunction, 'callback', methodName, _this2.getLabel());
	            }
	          }
	          return _this2.getOriginalInstance()[methodName](args, callbackFunction);
	        };
	      }
	    }
	  }]);
	
	  return _class;
	}(Wrapper);

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/* global angular */
	var Mock = __webpack_require__(7);
	
	module.exports = function (_Mock) {
	  _inherits(_class, _Mock);
	
	  function _class() {
	    _classCallCheck(this, _class);
	
	    return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
	  }
	
	  _createClass(_class, [{
	    key: 'generateMockedVersionOfCallback',
	
	
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
	
	    value: function generateMockedVersionOfCallback(originalCallback, callbackName, methodName, instanceName) {
	      var $rootScope = this.$rootScope;
	      var service = this.service;
	
	      return function () {
	        var _$rootScope$$broadcas;
	
	        // Broadcast through the generic event name
	        (_$rootScope$$broadcas = $rootScope.$broadcast).bind.apply(_$rootScope$$broadcas, _toConsumableArray([$rootScope, service.getEventNameFor(methodName, callbackName, instanceName)].concat(Array.prototype.slice.call(arguments))))();
	
	        // Call the original callback
	        if (callbackName && angular.isFunction(originalCallback)) {
	          originalCallback.apply(undefined, arguments);
	        }
	      };
	    }
	  }]);
	
	  return _class;
	}(Mock);

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* global angular */
	/* eslint prefer-spread: 0 */
	
	module.exports = function () {
	  function _class(label, service, $rootScope, wrapper) {
	    _classCallCheck(this, _class);
	
	    this.wrapper = wrapper;
	    this.label = label;
	    this.$rootScope = $rootScope;
	    this.service = service;
	    this.broadcastStatus = false;
	    this.broadcastedChannels = {};
	    this.broadcastedPresenceChannels = {};
	    this.subscribeListener = null;
	  }
	
	  _createClass(_class, [{
	    key: 'initializeSubscribeListener',
	    value: function initializeSubscribeListener() {
	      var $rootScope = this.$rootScope;
	      var service = this.service;
	      var self = this;
	      this.subscribeListener = this.service.getInstance(this.label).addListener({
	        message: function message(m) {
	          if (m.subscription && self.broadcastedChannels[m.subscription] || m.channel && self.broadcastedChannels[m.channel]) {
	            $rootScope.$broadcast.bind.apply($rootScope.$broadcast, [$rootScope, service.getMessageEventNameFor(m.subscribedChannel, self.label)].concat(Array.prototype.slice.call(arguments)))();
	          }
	        },
	        presence: function presence(m) {
	          var presenceChannel = null;
	          // If from channel group
	          if (m.subscription !== null && self.broadcastedPresenceChannels[m.subscription]) {
	            presenceChannel = m.subscription;
	          } else if (m.channel !== null && self.broadcastedPresenceChannels[m.channel]) {
	            presenceChannel = m.channel;
	          }
	
	          if (presenceChannel !== null) {
	            $rootScope.$broadcast.bind.apply($rootScope.$broadcast, [$rootScope, service.getPresenceEventNameFor(presenceChannel, self.label)].concat(Array.prototype.slice.call(arguments)))();
	          }
	        },
	        status: function status() {
	          if (self.broadcastStatus) {
	            var eventName = self.service.getEventNameFor('subscribe', 'status', self.label);
	            self.$rootScope.$broadcast.bind.apply(self.$rootScope.$broadcast, [self.$rootScope, eventName].concat(Array.prototype.slice.call(arguments)))();
	          }
	        }
	      });
	    }
	  }, {
	    key: 'enableEventsBroadcast',
	    value: function enableEventsBroadcast(eventsToBroadcast, args) {
	      var _this = this;
	
	      eventsToBroadcast.forEach(function (eventToBroadcast) {
	        if (eventToBroadcast === 'status') {
	          _this.broadcastStatus = true;
	        }
	        if (eventToBroadcast === 'message') {
	          // Adds any message channel which are not presence channels
	          if (args.channels && args.channels.length > 0) {
	            args.channels.forEach(function (channel) {
	              if (channel.slice(-7) !== '-pnpres') {
	                _this.broadcastedChannels[channel] = true;
	              }
	            });
	          }
	          // Adds any message channel group which are not presence channels
	          if (args.channelGroups && args.channelGroups.length > 0) {
	            args.channelGroups.forEach(function (channelGroup) {
	              if (channelGroup.slice(-7) !== '-pnpres') {
	                _this.broadcastedChannels[channelGroup] = true;
	              }
	            });
	          }
	        }
	        if (eventToBroadcast === 'presence') {
	          // Adds the presence channels of the current channels
	          if (args.withPresence) {
	            if (args.channels && args.channels.length > 0) {
	              args.channels.forEach(function (channel) {
	                return _this.broadcastedPresenceChannels[channel] = true;
	              });
	            }
	            if (args.channelGroups && args.channelGroups) {
	              args.channelGroups.forEach(function (channelGroup) {
	                return _this.broadcastedPresenceChannels[channelGroup] = true;
	              });
	            }
	            // Add the presence channels that have been subscribed directely
	          } else {
	            if (args.channels && args.channels.length > 0) {
	              args.channels.forEach(function (channel) {
	                if (channel.slice(-7) === '-pnpres') {
	                  _this.broadcastedPresenceChannels[channel.slice(0, -7)] = true;
	                }
	              });
	            }
	            if (args.channelGroups && args.channelGroups) {
	              args.channelGroups.forEach(function (channelGroup) {
	                if (channelGroup.slice(-7) === '-pnpres') {
	                  _this.broadcastedPresenceChannels[channelGroup.slice(0, -7)] = true;
	                }
	              });
	            }
	          }
	        }
	      });
	      if (this.subscribeListener === null) {
	        this.initializeSubscribeListener();
	      }
	    }
	  }]);
	
	  return _class;
	}();

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = {
		"methods_to_delegate": [
			"setUUID",
			"getUUID",
			"setAuthKey",
			"addListener",
			"removeListener",
			"unsubscribe",
			"unsubscribeAll",
			"time",
			"stop",
			"encrypt",
			"decrypt",
			"setFilterExpression"
		],
		"methods_to_wrap": [
			"publish",
			"fire",
			"hereNow",
			"whereNow",
			"setState",
			"getState",
			"grant",
			"history",
			{
				"push": [
					"addChannels",
					"deleteDevice",
					"listChannels",
					"removeChannels"
				]
			},
			{
				"channelGroups": [
					"addChannels",
					"deleteGroup",
					"listChannels",
					"listGroups",
					"removeChannels"
				]
			}
		],
		"common_callbacks_to_wrap": [
			"callback"
		],
		"subscribe_listener_events_to_broadcast": [
			"message",
			"presence",
			"status"
		]
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var pubnubConfig = __webpack_require__(3);
	/* global angular */
	angular.module('pubnub.angular.service').factory('$pubnubChannel', ['$rootScope', 'Pubnub', '$q', function ($rootScope, Pubnub, $q) {
	  /**
	  * Constructor
	  * The constructor is called through this way $pubnubChannel(channelName, options) and shoudld rarely called directely
	  * Optionnal parameters available to pass in the options hash:
	  * {
	  *    instance: 'deluxeInstance',  // The instance that will be used, default: {default PubNub instance}
	  *    autoload: 50,                // The number of messages we want to autoload from history, default: none
	  *    autosubscribe: true,         // Automatically subscribe to the channel, default: true
	  *    presence: false              // If autosubscribe enabled, subscribe and trigger the presence events, default: false
	  *    autostore: true              // Automatically store the messages received, default: true
	  *
	  * }
	  * @param {String} channel
	  * @param {Hash} config
	  * @returns {Array}
	  * @constructor
	  */
	  function PubnubChannel(channel) {
	    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	    // Instanciate the PubnubChannel and return it
	    if (!(this instanceof PubnubChannel)) {
	      return new PubnubChannel(channel, config);
	    }
	
	    if (!channel) {
	      throw new Error('The channel name is required');
	    }
	    // autosubscribe
	    if (config.autosubscribe && !(typeof config.autosubscribe === 'boolean')) {
	      throw new Error('The autosubscribe parameter should be a boolean');
	    }
	    // presence
	    if (config.presence && !(typeof config.presence === 'boolean')) {
	      throw new Error('The presence parameter should be a boolean');
	    }
	    // autostore
	    if (config.autostore && !(typeof config.autostore === 'boolean')) {
	      throw new Error('The autostore parameter should be a boolean');
	    }
	
	    var self = this;
	    // The channel we get data from
	    this._channel = channel;
	    // List that will store the messages received from the channel
	    this.$messages = [];
	    // Timetoken of the first message of the list
	    // usefull for knowing from where to fetch the list history from
	    this._timeTokenFirstMessage = null;
	    // Indicates if all the messages have been fetched from PubNub history
	    this._messagesAllFetched = false;
	    // PubNub Instance that will be used by this PubNub channel
	    this._pubnubInstance = config.instance ? Pubnub.getInstance(config.instance) : Pubnub.getInstance(pubnubConfig.default_instance_name);
	    // Number of messages (between 0 and 100) to autoload in this array calling PubNub history
	    this._autoload = config.autoload == null ? 0 : config.autoload;
	    // Subscribe and trigger the presence events
	    this._presence = config.presence == null ? false : config.presence;
	    // Indicates if it should automatically subscribe to the PubNub channel, default: true
	    this._autosubscribe = config.autosubscribe == null ? true : config.autosubscribe;
	    // Indicates if it should store automatically the messages received from PubNub
	    this._autostore = config.autostore == null ? true : config.autostore;
	
	    // Bind the public methods to make them available on the array.
	    this.$$getPublicMethods(function (fn, key) {
	      self.$messages[key] = fn.bind(self);
	    });
	
	    // The handler that allow to stop listening to new messages
	    this._unsubscribeHandler = null;
	
	    // Autoload the messages
	    if (this._autoload !== 0) {
	      this.$load(this._autoload);
	    }
	
	    var eventsToTrigger = null;
	
	    if (Pubnub.getPubNubVersion() === '3') {
	      eventsToTrigger = ['callback', 'connect', 'reconnect', 'disconnect', 'error', 'idle'];
	    } else {
	      eventsToTrigger = ['status', 'message'];
	    }
	
	    // Trigger the presence event?
	    if (this._presence) {
	      eventsToTrigger.push('presence');
	    }
	
	    // Automatically subscribe to the channel
	    if (this._autosubscribe) {
	      // Automatically subscribe to the channel
	      var args = { triggerEvents: eventsToTrigger };
	      if (Pubnub.getPubNubVersion() === '3') {
	        args.channel = this._channel;
	        args.noheresync = true;
	      } else {
	        args.channels = [this._channel];
	        if (this._presence) {
	          args.withPresence = true;
	        }
	      }
	
	      this._pubnubInstance.subscribe(args);
	    }
	
	    // Automatically store the messages
	    if (this._autostore) {
	      var eventName = Pubnub.getMessageEventNameFor(self._channel, this._pubnubInstance.label);
	      this._unsubscribeHandler = $rootScope.$on(eventName, self.$$newMessage.bind(self));
	    }
	
	    return this.$messages;
	  }
	
	  PubnubChannel.prototype = {
	    /**
	    *   Fetch and load the previous messages in the $messages array
	    *   @param {Integer} numberOfMessages : number of messages we want to load.
	    *   @returns {Promise} messages loaded or error
	    */
	    $load: function $load(numberOfMessages) {
	      if (!(numberOfMessages > 0 && numberOfMessages <= 100)) {
	        throw new Error('The number of messages to load should be a number between 0 and 100');
	      }
	
	      var self = this;
	      var deferred = $q.defer();
	
	      var args = {
	        channel: self._channel,
	        count: numberOfMessages,
	        reverse: false
	      };
	
	      var callback = null;
	
	      if (Pubnub.getPubNubVersion() === '3') {
	        args.callback = function (m) {
	          // Update the timetoken of the first message
	          self._timeTokenFirstMessage = m[1];
	
	          self.$$storeBatch(m[0]);
	
	          // Updates the indicator that all messages have been fetched.
	          if (m[0].length < numberOfMessages) {
	            self._messagesAllFetched = true;
	          }
	
	          deferred.resolve(m);
	          $rootScope.$digest();
	        };
	        args.error = function (err) {
	          deferred.reject(err);
	        };
	      } else {
	        callback = function callback(status, response) {
	          if (status.error) {
	            deferred.reject(response);
	          } else {
	            // Update the timetoken of the first message
	            self._timeTokenFirstMessage = response.startTimeToken;
	
	            self.$$storeBatch(response.messages.map(function (item) {
	              return item.entry;
	            }));
	
	            // Updates the indicator that all messages have been fetched.
	            if (response.messages.length < numberOfMessages) {
	              self._messagesAllFetched = true;
	            }
	
	            deferred.resolve(response);
	            $rootScope.$digest();
	          }
	        };
	      }
	
	      // If there is already messages in the array and consequently a first message timetoken
	      if (self._timeTokenFirstMessage) {
	        args.start = self._timeTokenFirstMessage;
	      }
	
	      self._pubnubInstance.history(args, callback);
	      return deferred.promise;
	    },
	
	
	    /**
	    * Publish a message in the channel
	    * @param {Hash} message : message we want to send
	    * @returns {Promise} messages loaded or error
	    */
	    $publish: function $publish(_message) {
	      var self = this;
	      var deferred = $q.defer();
	      var options = {
	        channel: self._channel,
	        message: _message
	      };
	
	      var callback = null;
	
	      if (Pubnub.getPubNubVersion() === '3') {
	        options.callback = function (m) {
	          deferred.resolve(m);
	        };
	        options.error = function (err) {
	          deferred.reject(err);
	        };
	      } else {
	        callback = function callback(status, response) {
	          if (status.error) {
	            deferred.reject(response);
	          } else {
	            deferred.resolve(response);
	          }
	        };
	      }
	
	      self._pubnubInstance.publish(options, callback);
	      return deferred.promise;
	    },
	
	
	    /**
	    * Return the Pubnub instance associated to this PubNub Channel
	    * @returns {Pubnub} the Pubnub instance
	    */
	    $pubnubInstance: function $pubnubInstance() {
	      return this._pubnubInstance;
	    },
	
	
	    /**
	    * Return the channel name on which this PubnubChannel
	    * @returns {String} the channel name
	    */
	    $channel: function $channel() {
	      return this._channel;
	    },
	
	
	    /**
	    * Indicates if all the messages have been fetched
	    * @returns {Boolean} all the messages have been loaded
	    */
	    $allLoaded: function $allLoaded() {
	      return this._messagesAllFetched;
	    },
	
	
	    /**
	    * Inform the object to not receive the events anymore
	    * and and clears memory being used by this array
	    */
	    $destroy: function $destroy() {
	      if (this._unsubscribeHandler) {
	        this._unsubscribeHandler();
	      }
	      this.$messages.length = 0;
	    },
	
	
	    /**
	    * Called when an new message has been received in the channel from the PubNub network
	    * @protected
	    */
	    $$newMessage: function $$newMessage(ngEvent, m) {
	      if (Pubnub.getPubNubVersion() === '3') {
	        this.$$store(m);
	      } else {
	        this.$$store(m.message);
	      }
	      $rootScope.$digest();
	    },
	
	
	    /**
	    * Function called to store a message in the messages array.
	    * @protected
	    */
	    $$store: function $$store(message) {
	      this.$messages.push(message);
	    },
	
	
	    /**
	    * Function called in order to store a batch of message in the messages array.
	    * @protected
	    */
	    $$storeBatch: function $$storeBatch(messages) {
	      // We add the messages in the array
	      if (this.$messages.length === 0) {
	        angular.extend(this.$messages, messages);
	      } else {
	        Array.prototype.unshift.apply(this.$messages, messages);
	      }
	    },
	
	
	    /**
	    * These methods allow the PubNub channel to extend his array with his Public methods
	    */
	
	    // Get the list of the public methods of the PubnubChannel (prefixed by $)
	    // Return the list of the public methods of the prototype
	    $$getPublicMethods: function $$getPublicMethods(iterator, context) {
	      this.$$getPrototypeMethods(function (m, k) {
	        if (typeof m === 'function' && k.charAt(0) !== '_') {
	          iterator.call(context, m, k);
	        }
	      });
	    },
	
	
	    // Get the list of the methods of the PubnubChannel
	    // Return the list of the methods of the prototype
	    $$getPrototypeMethods: function $$getPrototypeMethods(iterator, context) {
	      var methods = {};
	      var objProto = Object.getPrototypeOf({});
	      var proto = angular.isFunction(this) && angular.isObject(this.prototype) ? this.prototype : Object.getPrototypeOf(this);
	      while (proto && proto !== objProto) {
	        Object.keys(proto).forEach(function (key) {
	          if ({}.hasOwnProperty.call(proto, key) && !{}.hasOwnProperty.call(methods, key)) {
	            methods[key] = true;
	            iterator.call(context, proto[key], key, proto);
	          }
	        });
	        proto = Object.getPrototypeOf(proto);
	      }
	    }
	  };
	
	  /**
	  * This method allows a PubnubChannel to be inherited
	  * The methods passed into this function will be added onto the array's prototype.
	  /* They can override existing methods as well.
	   * @param {Object} methods a list of functions to add onto the prototype
	  * @returns {Function} the extended pubnubChannel object
	  * @static
	  */
	  PubnubChannel.$extend = function (methods) {
	    if (!angular.isObject(methods)) {
	      throw new Error('The methods parameter should be an object');
	    }
	
	    var ExtendedPubnubChannel = function ExtendedPubnubChannel(channel, config) {
	      if (!(this instanceof PubnubChannel)) {
	        return new ExtendedPubnubChannel(channel, config);
	      }
	      PubnubChannel.apply(this, arguments);
	      return this.$messages;
	    };
	
	    ExtendedPubnubChannel.prototype = Object.create(PubnubChannel.prototype);
	    angular.extend(ExtendedPubnubChannel.prototype, methods);
	
	    return ExtendedPubnubChannel;
	  };
	
	  return PubnubChannel;
	}]);

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* @flow */
	
	var pubnubConfig = __webpack_require__(3);
	/* global angular */
	angular.module('pubnub.angular.service').factory('$pubnubChannelGroup', ['$rootScope', '$q', 'Pubnub', '$pubnubChannel', function ($rootScope, $q, Pubnub, $pubnubChannel) {
	  /**
	   * Constructor
	   * The constructor is called through this way $pubnubChannelGroup(channelGroup, options) and shoudld rarely called directely
	   * This object is a container of channels
	   * You can access to one of a channel by calling the #getChannel(channel) method
	   * Optionnal parameters available to pass in the config hash:
	   * {
	   *    instance: 'deluxeInstance',  // The instance that will be used, default: {default PubNub instance}
	   *    autosubscribe: true,         // Automatically subscribe to the channel group, default: true
	   *    presence: false              // If autosubscribe enabled, subscribe and trigger the presence events for the channel group, default: false
	   *    channelExtension: {foo: function(){ return "bar"}} // Define additionnal functions or override some for the channel instanciated
	   *
	   * }
	   * @param {String} channelGroup | {Hash} config
	   * @returns the channel group itself;
	   * @constructor
	   */
	  function PubnubChannelGroup(channelGroup, _config) {
	    // Instanciate the PubnubChannelGroup and return it
	    if (!(this instanceof PubnubChannelGroup)) {
	      return new PubnubChannelGroup(channelGroup, _config);
	    }
	
	    var self = this;
	    var config = _config || {};
	
	    if (!channelGroup) {
	      throw new Error('The channel group name is required');
	    }
	
	    // autosubscribe
	    if (config.autosubscribe && !(typeof config.autosubscribe === 'boolean')) {
	      throw new Error('The autosubscribe parameter should be a boolean');
	    }
	    // presence
	    if (config.presence && !(typeof config.presence === 'boolean')) {
	      throw new Error('The presence parameter should be a boolean');
	    }
	
	    if (config.channelExtension && !angular.isObject(config.channelExtension)) {
	      throw new Error('The channelExtension should be an object');
	    }
	
	    this._channelGroup = channelGroup;
	    // Maintain the list of channel objects
	    this.$channels = {};
	    // PubNub Instance that will be used by this PubNub channel
	    this._pubnubInstance = config.instance ? Pubnub.getInstance(config.instance) : Pubnub.getInstance(pubnubConfig.default_instance_name);
	    // Subscribe and trigger the presence events
	    this._presence = config.presence == null ? false : config.presence;
	    // Indicates if it should automatically subscribe to the PubNub channel, default: true
	    this._autosubscribe = config.autosubscribe == null ? true : config.autosubscribe;
	    // Extensions for the channel beeing instanciated
	    this._extendedChannel = config.channelExtension ? $pubnubChannel.$extend(config.channelExtension) : null;
	    // The handler that allow to stop listening to new messages
	    this._unsubscribeHandler = null;
	
	    var eventsToTrigger = null;
	    if (Pubnub.getPubNubVersion() === '3') {
	      eventsToTrigger = ['callback', 'connect', 'reconnect', 'disconnect', 'error', 'idle'];
	    } else {
	      eventsToTrigger = ['status', 'message'];
	    }
	    // Trigger the presence event?
	    if (this._presence) {
	      eventsToTrigger.push('presence');
	    }
	    // Automatically subscribe to the channel
	    if (this._autosubscribe) {
	      // Automatically subscribe to the channel
	      var args = { triggerEvents: eventsToTrigger };
	      if (Pubnub.getPubNubVersion() === '3') {
	        args.channel_group = this._channelGroup;
	      } else {
	        args.channelGroups = [this._channelGroup];
	      }
	      this._pubnubInstance.subscribe(args);
	    }
	
	    // Allow to unsubscribe to the channel group
	    var eventName = Pubnub.getMessageEventNameFor(self._channelGroup, self._pubnubInstance.label);
	    this._unsubscribeHandler = $rootScope.$on(eventName, self.$$newMessage.bind(self));
	
	    return this;
	  }
	
	  PubnubChannelGroup.prototype = {
	    /**
	     * Return the channel object specified from the name
	     * the message can be from any channel of the channel group
	     * @protected
	     */
	    $channel: function $channel(channel) {
	      if (!angular.isDefined(this.$channels[channel])) {
	        var options = {
	          instance: this._pubnubInstance.label,
	          autosubscribe: false,
	          presence: false,
	          autostore: true
	        };
	        var newChannel = this._extendedChannel ? new this._extendedChannel(channel, options) : $pubnubChannel(channel, options);
	        this.$channels[channel] = newChannel;
	      }
	
	      return this.$channels[channel];
	    },
	
	
	    /**
	     * Return the Pubnub instance associated to this PubNub Channel Group
	     * @returns {Pubnub} the Pubnub instance
	     */
	    $pubnubInstance: function $pubnubInstance() {
	      return this._pubnubInstance;
	    },
	
	
	    /**
	     * Return the channel name on which this PubnubChannelGroup is based
	     * @returns {String} the channel name
	     */
	    $channelGroup: function $channelGroup() {
	      return this._channelGroup;
	    },
	
	
	    /**
	     * Inform the object to not receive the events anymore
	     * and and clears memory being used by this array
	     */
	    $destroy: function $destroy() {
	      var _this = this;
	
	      this._unsubscribeHandler();
	      Object.keys(this.$channels).forEach(function (channel) {
	        if ({}.hasOwnProperty.call(_this.$channels, channel)) {
	          delete _this.$channels[channel];
	        }
	      });
	    },
	
	
	    /**
	     * Called when an new message has been received in the channel from the PubNub network
	     * the message can be from any channel of the channel group
	     * @protected
	     */
	    $$newMessage: function $$newMessage(ngEvent, message, env) {
	      var channel = null;
	      if (Pubnub.getPubNubVersion() === '3') {
	        channel = env[3];
	      } else {
	        channel = message.channel;
	      }
	      this.$channel(channel).$$newMessage(ngEvent, message, env);
	    }
	  };
	
	  return PubnubChannelGroup;
	}]);

/***/ }
/******/ ]);
//# sourceMappingURL=pubnub-angular.js.map