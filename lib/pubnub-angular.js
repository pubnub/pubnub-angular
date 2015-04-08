angular.module('pubnub.angular.service', []).factory('Pubnub', ['$rootScope', function ($rootScope) {
    if (!exists(PUBNUB)) {
        throw new Error("PUBNUB is not in global scope. Ensure that pubnub.js file is included before pubnub-angular.js");
    }

    var PUBNUB_PREFIX = "pubnub";

    var config = {
        methods_to_delegate: ['history', 'replay', 'publish', 'unsubscribe', 'here_now', 'grant', 'revoke',
            'audit', 'time', 'where_now', 'state',
            'channel_group', 'channel_group_list_channels', 'channel_group_list_groups', 'channel_group_list_namespaces',
            'channel_group_remove_channel', 'channel_group_remove_group', 'channel_group_remove_namespace',
            'channel_group_add_channel', 'channel_group_cloak', 'set_uuid', 'get_uuid', 'uuid', 'auth',
            'set_cipher_key', 'get_cipher_key', 'raw_encrypt', 'raw_decrypt',
            'set_heartbeat', 'get_heartbeat', 'set_heartbeat_interval', 'get_heartbeat_interval'],

        subscribe_callbacks_to_wrap: ['callback', 'connect', 'reconnect', 'disconnect', 'error', 'idle', 'presence']
    };

    var service = {},
        wrappers = {},
        defaultInstanceName = 'main',
        i;

    service.init = function (initConfig) {
        return service.getInstance(defaultInstanceName).init(initConfig);
    };

    service.getInstance = function (instanceName) {
        var instance = wrappers[instanceName];

        if (exists(instance)) {
            return instance;
        } else if (typeof instanceName === 'string' && instanceName.length > 0) {
            wrappers[instanceName] = new Wrapper(name);

            return wrappers[instanceName];
        }

        return instance;
    };

    service.getEventNameFor = function (methodName, callbackName, instanceName) {
        if (!instanceName) instanceName = defaultInstanceName;

        return [PUBNUB_PREFIX, instanceName, callbackName].join(':');
    };

    service.getMessageEventNameFor = function (channelName, instanceName) {
        if (!instanceName) instanceName = defaultInstanceName;

        return [PUBNUB_PREFIX, instanceName, 'subscribe', channelName].join(':');
    };

    service.getPresenceEventNameFor = function (channelName, instanceName) {
        if (!instanceName) instanceName = defaultInstanceName;

        return [PUBNUB_PREFIX, instanceName, 'presence', channelName].join(':');
    };

    service.subscribe = function (args) {
        this.getInstance(defaultInstanceName).subscribe(args);
    };

    function Wrapper(name) {
        this.name = name;
        this.pubnubInstance = null;
    }

    Wrapper.prototype.getName = function () {
        return this.name;
    };

    // Wrap standard methods
    for (i = 0; i < config.methods_to_delegate.length; i++) {
        (function (method) {
            Wrapper.prototype[method] = function (args) {
                if ('triggerEvent' in args && !!args['triggerEvent']) {
                    mockCallbacks(this.name, method, args, ['callback', 'error']);
                }

                this.getOriginalInstance()[method](args);
            };

            service[method] = function (args) {
                this.getInstance(defaultInstanceName)[method](args);
            }
        })(config.methods_to_delegate[i]);
    }

    // Wrap subscribe callbacks
    Wrapper.prototype.subscribe = function (args) {
        mockCallbacks(this.name, 'subscribe', args, config.subscribe_callbacks_to_wrap);

        this.getOriginalInstance().subscribe(args);
    };

    Wrapper.prototype.init = function (initConfig) {
        this.pubnubInstance = new PUBNUB.init(initConfig);
    };

    Wrapper.prototype.getOriginalInstance = function () {
        if (this.pubnubInstance) {
            return this.pubnubInstance;
        } else {
            throw new Error("Pubnub default instance is not initialized yet. Invoke #init() method first.")
        }
    };

    function exists(input) {
        return (typeof input !== 'undefined' && input !== null);
    }

    function mockCallbacks(instanceName, methodName, object, callbacksList) {
        var l = callbacksList.length,
            originalCallbacks = {},
            currentCallbackName,
            i;

        for (i = 0; i < l; i++) {
            currentCallbackName = callbacksList[i];
            originalCallbacks[currentCallbackName] = object[currentCallbackName];

            (function (callbackName) {
                object[currentCallbackName] = function () {
                    $rootScope.$broadcast(service.getEventNameFor(methodName, callbackName, instanceName), arguments);

                    if (callbackName in originalCallbacks && typeof originalCallbacks[callbackName] === 'function') {
                        originalCallbacks[callbackName].apply(null, arguments);
                    }

                    // REVIEW:
                    if (methodName === 'subscribe') {
                        switch (callbackName) {
                            case 'callback':
                                $rootScope.$broadcast(service.getMessageEventNameFor(arguments[2], instanceName), arguments);
                                break;
                            case 'presence':
                                $rootScope.$broadcast(service.getPresenceEventNameFor(arguments[2], instanceName), arguments);
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
