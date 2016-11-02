/* global angular */
module.exports = class {

  constructor(label, service, $rootScope) {
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
  getCallbacksToMock(argsValue, initialCallbackNames) {
    let triggerEventsValue = argsValue.triggerEvents;
    let result = [];
    let length;
    let value;
    let i;

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
};
