var angularApp = angular.module('myApp', ['pubnub.angular.service']);

//angular.module('myApp', );

  // controller here
angularApp.controller('FirstCtrl', function($scope, Pubnub) {
  Pubnub.init({ publish_key: 'demo-36', subscribe_key: 'demo-36' });
  $scope.data = {message: "Hello"};
});
