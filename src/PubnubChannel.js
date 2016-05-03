(function() {
  'use strict';
  
  angular.module('pubnub.angular.service')
    .factory('$pubnubChannel', ['$rootScope', function ($rootScope) {
        
      constructor(channel,config) {
        if(!channel){
          throw new Error('You should specifiy a channel name');
        }
      }
        
  }]);
})