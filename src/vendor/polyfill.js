/* istanbul ignore next */
// Object.create(proto[, propertiesObject])
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
if (typeof Object.create !== 'function') {
  Object.create = (function () {
    let Temp = function () {};
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
      let result = new Temp();
      Temp.prototype = null;
      return result;
    };
  })();
}
