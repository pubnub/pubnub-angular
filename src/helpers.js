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
