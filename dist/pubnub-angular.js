angular.module('pubnub.angular.service', []).factory('Pubnub', ['$rootScope', function ($rootScope) {
    if (!exists(PUBNUB)) {
        throw new Error("PUBNUB is not in global scope. Ensure that pubnub.js file is included before pubnub-angular.js");
    }

    var config = {
        pubnub_prefix: 'pubnub',
        methods_to_delegate: ['history', 'replay', 'publish', 'unsubscribe', 'here_now', 'grant', 'revoke',
            'audit', 'time', 'where_now', 'state',
            'channel_group', 'channel_group_list_channels', 'channel_group_list_groups', 'channel_group_list_namespaces',
            'channel_group_remove_channel', 'channel_group_remove_group', 'channel_group_remove_namespace',
            'channel_group_add_channel', 'channel_group_cloak', 'set_uuid', 'get_uuid', 'uuid', 'auth',
            'set_cipher_key', 'get_cipher_key', 'raw_encrypt', 'raw_decrypt',
            'set_heartbeat', 'get_heartbeat', 'set_heartbeat_interval', 'get_heartbeat_interval'],
        common_callbacks_to_wrap: ['callback', 'error'],
        subscribe_callbacks_to_wrap: ['callback', 'connect', 'reconnect', 'disconnect', 'error', 'idle', 'presence']
    };

    var service = {},
        wrappers = {},
        defaultInstanceName = 'default',
        i;

    /**
     * Initializer for default instance
     *
     * @param {Object} initConfig
     */
    service.init = function (initConfig) {
        return service.getInstance(defaultInstanceName).init(initConfig);
    };

    /**
     * Instance getter
     *
     * @param instanceName
     * @returns {Wrapper}
     */
    service.getInstance = function (instanceName) {
        var instance = wrappers[instanceName];

        if (exists(instance)) {
            return instance;
        } else if (typeof instanceName === 'string' && instanceName.length > 0) {
            wrappers[instanceName] = new Wrapper(instanceName);

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
        if (!instanceName) instanceName = defaultInstanceName;

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
        if (!instanceName) instanceName = defaultInstanceName;

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
        if (!instanceName) instanceName = defaultInstanceName;

        return [config.pubnub_prefix, instanceName, 'subscribe', 'presence', channelName].join(':');
    };

    /**
     * Subscribe method wrapper for default instance
     *
     * @param {object} args
     */
    service.subscribe = function (args) {
        this.getInstance(defaultInstanceName).subscribe(args);
    };

    /**
     * Wrapper for native Pubnub JavaScript SDK
     *
     * @param {string} label
     * @constructor
     */
    function Wrapper(label) {
        this.label = label;
        this.pubnubInstance = null;
    }

    /**
     * Get instance label
     *
     * @returns {String}
     */
    Wrapper.prototype.getLabel = function () {
        return this.label;
    };

    // Wrap standard methods dynamically
    for (i = 0; i < config.methods_to_delegate.length; i++) {
        (function (method) {
            Wrapper.prototype[method] = function (args) {
                if (isObject(args)) {
                    mockCallbacks(this.getLabel(), method, args, getCallbacksToMock(args, config.common_callbacks_to_wrap));
                }

                return this.getOriginalInstance()[method](args);
            };

            service[method] = function (args) {
                return this.getInstance(defaultInstanceName)[method](args);
            }
        })(config.methods_to_delegate[i]);
    }

    /**
     * Subscribe method wrapper
     *
     * @param {object} args
     */
    Wrapper.prototype.subscribe = function (args) {
        mockCallbacks(this.getLabel(), 'subscribe', args, getCallbacksToMock(args, config.subscribe_callbacks_to_wrap));

        this.getOriginalInstance().subscribe(args);
    };

    /**
     * New pubnub instance initializer
     *
     * @param {object} initConfig
     */
    Wrapper.prototype.init = function (initConfig) {
        this.pubnubInstance = new PUBNUB.init(initConfig);
    };

    /**
     * Pubnub original instance getter
     *
     * @throws {ReferenceError} when instance is not initialized yet
     * @returns {Object}
     */
    Wrapper.prototype.getOriginalInstance = function () {
        if (this.pubnubInstance) {
            return this.pubnubInstance;
        } else {
            throw new ReferenceError("Pubnub default instance is not initialized yet. Invoke #init() method first.")
        }
    };

    /**
     * Check does input value contain any value
     *
     * @param input
     * @returns {boolean}
     */
    function exists(input) {
        return (typeof input !== 'undefined' && input !== null);
    }

    /**
     * Check is input value an object
     *
     * @param input
     * @returns {boolean}
     */
    function isObject(input) {
        return typeof input === 'object' && input !== null;
    }

    /**
     * Check is input value is a function
     *
     * @param input
     * @returns {boolean}
     */
    function isFunction(input) {
        return typeof input === 'function';
    }

    /**
     * Return allowed and enabled in args callbacks array
     *
     * @param {Object} argsValue from method call
     * @param {Array} initialCallbackNames from config object
     * @returns {Array} of callbacks to mock
     */
    function getCallbacksToMock(argsValue, initialCallbackNames) {
        var triggerEventsValue = argsValue['triggerEvents'],
            result = [],
            length,
            value,
            i;

        if (triggerEventsValue === true) {
            return initialCallbackNames;
        } else if (isObject(triggerEventsValue)) {
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
    function mockCallbacks(instanceName, methodName, object, callbacksList) {
        var l = callbacksList.length,
            originalCallbacks = {},
            currentCallbackName,
            i;

        for (i = 0; i < l; i++) {
            currentCallbackName = callbacksList[i];

            if (!isObject(object)) {
                return;
            }

            originalCallbacks[currentCallbackName] = object[currentCallbackName];

            (function (callbackName) {
                object[currentCallbackName] = function () {
                    $rootScope.$broadcast.bind.apply(
                        $rootScope.$broadcast,
                        [$rootScope, service.getEventNameFor(methodName, callbackName, instanceName)]
                            .concat(Array.prototype.slice.call(arguments))
                    )();

                    if (callbackName in originalCallbacks && isFunction(originalCallbacks[callbackName])) {
                        originalCallbacks[callbackName].apply(null, arguments);
                    }

                    // REVIEW:
                    if (methodName === 'subscribe') {
                        switch (callbackName) {
                            case 'callback':
                                $rootScope.$broadcast.bind.apply(
                                    $rootScope.$broadcast,
                                    [$rootScope, service.getMessageEventNameFor(arguments[2], instanceName)]
                                        .concat(Array.prototype.slice.call(arguments))
                                )();
                                break;
                            case 'presence':
                                $rootScope.$broadcast.bind.apply(
                                    $rootScope.$broadcast,
                                    [$rootScope, service.getPresenceEventNameFor(arguments[2], instanceName)]
                                        .concat(Array.prototype.slice.call(arguments))
                                )();
                                break;
                            default:
                                break;
                        }
                    }
                };

            })(currentCallbackName);
        }
    }

    return service;
}]);
