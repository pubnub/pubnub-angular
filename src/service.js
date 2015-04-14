var service = {},
    wrappers = {},
    i;

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
