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
function mockCallbacks(instanceName, methodName, object, callbacksList) {
    var l = callbacksList.length,
        originalCallbacks = {},
        currentCallbackName,
        i;

    for (i = 0; i < l; i++) {
        currentCallbackName = callbacksList[i];

        if (!angular.isObject(object)) {
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

                if (callbackName in originalCallbacks && angular.isFunction(originalCallbacks[callbackName])) {
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
