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
            return this.getInstance(config.default_instance_name)[method](args);
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
