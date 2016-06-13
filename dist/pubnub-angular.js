/*! 3.2.1 */
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
	__webpack_require__(6);
	__webpack_require__(7);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* global angular PUBNUB */
	
	var config = __webpack_require__(3);
	var Wrapper = __webpack_require__(4);
	
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
/* 3 */
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* global angular PUBNUB */
	
	var config = __webpack_require__(3);
	var Mocks = __webpack_require__(5);
	
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
	      this.pubnubInstance = new PUBNUB(initConfig);
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
/* 5 */
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
	    key: 'getCallbacksToMock',
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
	      for (i = 0; i < l; i++) {
	        if (!angular.isObject(methodArguments)) {
	          return;
	        }
	
	        currentCallbackName = callbacksList[i];
	        originalCallback = methodArguments[currentCallbackName];
	
	        // We replace the original callback with a mocked version.
	        methodArguments[currentCallbackName] = this.generateMockedVersionOfCallback(originalCallback, currentCallbackName, methodName, instanceName, methodArguments);
	      }
	    }
	
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
	
	  }, {
	    key: 'generateMockedVersionOfCallback',
	    value: function generateMockedVersionOfCallback(originalCallback, callbackName, methodName, instanceName, methodArguments) {
	      var $rootScope = this.$rootScope;
	      var service = this.service;
	      var channelName = methodArguments.channel || methodArguments.channel_group;
	
	      return function () {
	        // Broadcast through the generic event name
	        $rootScope.$broadcast.bind.apply($rootScope.$broadcast, [$rootScope, service.getEventNameFor(methodName, callbackName, instanceName)].concat(Array.prototype.slice.call(arguments)))();
	
	        // Call the original callback
	        if (callbackName && angular.isFunction(originalCallback)) {
	          originalCallback.apply(null, arguments);
	        }
	
	        // Broadcast through the message event or presence event
	        if (methodName === 'subscribe') {
	          switch (callbackName) {
	            case 'callback':
	              $rootScope.$broadcast.bind.apply($rootScope.$broadcast, [$rootScope, service.getMessageEventNameFor(channelName, instanceName)].concat(Array.prototype.slice.call(arguments)))();
	              break;
	            case 'presence':
	              $rootScope.$broadcast.bind.apply($rootScope.$broadcast, [$rootScope, service.getPresenceEventNameFor(channelName, instanceName)].concat(Array.prototype.slice.call(arguments)))();
	              break;
	            default:
	              break;
	          }
	        }
	      };
	    }
	  }]);
	
	  return _class;
	}();

/***/ },
/* 6 */
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
	  function PubnubChannel(channel, config) {
	    // Instanciate the PubnubChannel and return it
	    if (!(this instanceof PubnubChannel)) {
	      return new PubnubChannel(channel, config);
	    }
	
	    config = config || {};
	
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
	
	    var eventsToTrigger = ['callback', 'connect', 'reconnect', 'disconnect', 'error', 'idle'];
	    // Trigger the presence event?
	    if (this._presence) {
	      eventsToTrigger.push('presence');
	    }
	    // Automatically subscribe to the channel
	    if (this._autosubscribe) {
	      this._pubnubInstance.subscribe({
	        channel: this._channel,
	        triggerEvents: eventsToTrigger
	      });
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
	        reverse: false,
	        callback: function callback(m) {
	          // Update the timetoken of the first message
	          self._timeTokenFirstMessage = m[1];
	
	          self.$$storeBatch(m[0]);
	
	          // Updates the indicator that all messages have been fetched.
	          if (m[0].length < numberOfMessages) {
	            self._messagesAllFetched = true;
	          }
	
	          deferred.resolve(m);
	          $rootScope.$digest();
	        },
	        error: function error(err) {
	          deferred.reject(err);
	        }
	      };
	
	      // If there is already messages in the array and consequently a first message timetoken
	      if (self._timeTokenFirstMessage) {
	        args.start = self._timeTokenFirstMessage;
	      }
	
	      self._pubnubInstance.history(args);
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
	      self._pubnubInstance.publish({
	        channel: self._channel,
	        message: _message,
	        callback: function callback(m) {
	          deferred.resolve(m);
	        },
	        error: function error(err) {
	          deferred.reject(err);
	        }
	      });
	
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
	      this.$$store(m);
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
	        for (var key in proto) {
	          if (proto.hasOwnProperty(key) && !methods.hasOwnProperty(key)) {
	            methods[key] = true;
	            iterator.call(context, proto[key], key, proto);
	          }
	        }
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
/* 7 */
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
	
	    var eventsToTrigger = ['callback', 'connect', 'reconnect', 'disconnect', 'error', 'idle'];
	    // Trigger the presence event?
	    if (this._presence) {
	      eventsToTrigger.push('presence');
	    }
	    // Automatically subscribe to the channel
	    if (this._autosubscribe) {
	      this._pubnubInstance.subscribe({
	        channel_group: this._channelGroup,
	        triggerEvents: eventsToTrigger
	      });
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
	      this._unsubscribeHandler();
	
	      for (var channel in this.$channels) {
	        if (this.$channels.hasOwnProperty(channel)) {
	          delete this.$channels[channel];
	        }
	      }
	    },
	
	
	    /**
	     * Called when an new message has been received in the channel from the PubNub network
	     * the message can be from any channel of the channel group
	     * @protected
	     */
	    $$newMessage: function $$newMessage(ngEvent, message, env) {
	      var channel = env[3];
	      this.$channel(channel).$$newMessage(ngEvent, message, env);
	    }
	  };
	
	  return PubnubChannelGroup;
	}]);

/***/ }
/******/ ]);
//# sourceMappingURL=pubnub-angular.js.map