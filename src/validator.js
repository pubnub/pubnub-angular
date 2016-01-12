if (!angular.isDefined(PUBNUB)) {
  throw new Error('PUBNUB is not in global scope. Ensure that pubnub.js file is included before pubnub-angular.js');
}
