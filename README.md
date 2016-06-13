# PubNub AngularJS SDK

![SDK Logo](http://cl.ly/241N0q2P2q22/Screen%20Shot%202016-02-03%20at%205.32.32%20PM.png)

[![Build Status](https://travis-ci.org/pubnub/pubnub-angular.svg?branch=master)](https://travis-ci.org/pubnub/pubnub-angular)
[![Codecov](https://img.shields.io/codecov/c/github/pubnub/pubnub-angular.svg?maxAge=2592000)](https://codecov.io/github/pubnub/pubnub-angular?branch=master)
[![npm](https://img.shields.io/npm/v/pubnub-angular.svg)](https://www.npmjs.com/package/pubnub-angular)
![Bower](https://img.shields.io/bower/v/pubnub-angular.svg)


Welcome! We're here to get you started quickly with your
integration between PubNub and AngularJS. PubNub makes it
easy to integrate real-time bidirectional communication
into your app.

**Pubnub Angular** service is a wrapper for PubNub JavaScript SDK
that adds a few of extra features to simplify Angular integrations:

* [Multiple instance behavior](https://github.com/pubnub/pubnub-angular#differences-in-usage-with-native-javascript-sdk). All instances are accessible
throughout application via ```Pubnub``` service.

* [Events](https://github.com/pubnub/pubnub-angular#events). Delegated methods accept the ```triggerEvents``` option which will broadcast certain callback as an AngularJS event.

* A [$pubnubChannel](https://github.com/pubnub/pubnub-angular#the-pubnubchannel-object) object that seamlessly binds a PubNub channel to a scope variable that gets updated with realtime data and allows you to interact with the channel through dedicated methods.

* A  [$pubnubChannelGroup](https://github.com/pubnub/pubnub-angular#the-pubnubchannelgroup-object) object that provides an easy-to-use interface for channel groups. It stores the incoming messages in containers split by the channel and exposes an interface to directely fetch messages by channel.

You can still use the native PubNub JavaScript SDK if you feel this will be
more suitable for your situation.

## Communication
- If you **need help** or have a **general question**, contact <support@pubnub.com>
- If you **want to contribute**, please open a pull request against the `develop` branch.

## Breaking Changes

  * 3.0.0
    * ng* prefix is removed from all the methods and now matches 1:1 to the parent javascript library.


## Integrating PubNub Angular SDK into Your App

Your HTML page will include 2 key libraries:

* PubNub JavaScript SDK
* PubNub JavaScript SDK Angular Service

Using [Bower](http://bower.io):

```bower install --save pubnub pubnub-angular```

Or using CDNs:

```html
<script src="http(s)://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-3.2.1.js"></script>
```

Also available as minified:

```html
<script src="http(s)://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-3.2.1.min.js"></script>
```

To utilize this wrapper, include the scripts in the following order:
```html
  <script src="(angular.js)"></script>
  <script src="(latest version of PubNub JS SDK from https://github.com/pubnub/javascript)"></script>
  <script src="(pubnub-angular.js)"></script>
```

We presume your app is already Angular-enabled with an ng-app
attribute or the equivalent:

```html
<body ng-app="PubNubAngularApp">
```

Where 'PubNubAngularApp' is the name of the Angular module
containing your app.

We presume the code for the app lives in:

```html
<script src="scripts/app.js"></script>
```

Inside ```app.js```, add an Angular dependency on the PubNub Angular library (```pubnub.angular.service```):

```javascript
angular.module('PubNubAngularApp', ["pubnub.angular.service"])
```

This will make sure that the PubNub object is available to get
injected into your controllers.

We presume the code for your controllers lives in:

```html
<script src="scripts/controllers/main.js"></script>
```

The Angular ```Pubnub``` service is injected into the controller as follows:

```javascript
.controller('MainCtrl', function($scope, Pubnub) { ... });
```

## Differences in usage with native JavaScript SDK

To learn about PubNub JavaScript features refer to native
[PubNub JavaScript SDK manual](http://www.pubnub.com/docs/javascript/javascript-sdk.html).
All methods of this SDK are wrapped with **Pubnub AngularJS Service**.

Native **Pubnub JavaScript SDK** provides instance creation using ```PUBNUB.init()```,
which returns new instance with given credentials. In **Pubnub Angular SDK** instances
are hidden inside service and are accessible via instance getter. Methods of default
instance are mapped directly to PubNub service like ```Pubnub.publish({...})```.

In most use cases, usage of the default PubNub instance will be sufficient, but if
 multiple instances with different credentials are needed, the ```Pubnub.getInstance(instanceName)``` getter needs to be utilized. In this case, the publish
method will looks like ```Pubnub.getInstance(instanceName).publish({})```.

The highlighted usage can be previewed in the two examples below. Both examples perform the
same job - creation of 2 PubNub instances with different credentials.
Publish method is invoked on the `__defaultInstance__` and grant method on `__anotherInstance__`.

First example shows how to do that using native **Pubnub JavaScript SDK**:

```javascript
var defaultInstance = PUBNUB.init({
    publish_key: 'your pub key',
    subscribe_key: 'your sub key'
});

var anotherInstance = PUBNUB.init({
    publish_key: 'another pub key',
    subscribe_key: 'another sub key'
});

defaultInstance.publish({
    channel: 'myChannel',
    message: 'Hello!',
    callback: function (m) {console.log(m);}
});

anotherInstance.grant({
    channel: 'my_channel',
    auth_key: 'my_authkey',
    read: true,
    write: false,
    callback: function (m) {console.log(m);}
});
```

Second example shows how to use **Pubnub AngularJS SDK** for this purposes:

```javascript
Pubnub.init({
    publish_key: 'your pub key',
    subscribe_key: 'your sub key'
});

Pubnub.getInstance('anotherInstance').init({
    publish_key: 'another pub key',
    subscribe_key: 'another sub key'
});

Pubnub.publish({
    channel: 'myChannel',
    message: 'Hello!',
    callback: function (m) {console.log(m);}
});

Pubnub.getInstance('anotherInstance').grant({
    channel: 'my_channel',
    auth_key: 'my_authkey',
    read: true,
    write: false,
    callback: function (m) {console.log(m);}
});
```

That's it - you're ready to start using the AngularJS PubNub SDK!

## Events

Another key feature of this SDK is ability to trigger method events
in addition to passed in callbacks. By default events will not be triggered.

To enable all possible events for certain method, add ```triggerEvents: true```
option to the method arguments:

```javascript
Pubnub.publish({
    channel  : $scope.selectedChannel,
    message  : $scope.newMessage,
    callback : function(info) { console.log(info) },
    triggerEvents: true
});
```

And then you can subscribe to these events using ```Pubnub.getEventNameFor(...)```
helper from anywhere in your app:

```javascript
$rootScope.$on(Pubnub.getEventNameFor('publish', 'callback'), function (ngEvent, payload) {
    $scope.$apply(function () {
        $scope.statusSentSuccessfully = true;
    });
});

$rootScope.$on(Pubnub.getEventNameFor('publish', 'error'), function (ngEvent, payload) {
    $scope.$apply(function () {
        $scope.statusSentSuccessfully = false;
    });
});
```

If you don't want to broadcast all events, you can explicitly specify
array of callback names you want to trigger. All callback names that
do not exist in native SDK will be ignored:

```javascript
Pubnub.publish({
    channel  : $scope.selectedChannel,
    message  : $scope.newMessage,
    callback : function(info) { console.log(info) },
    triggerEvents: ['callback']
  });
};
```

For *subscribe* method there are two helpers that provide you handlers for specific channel events:

```javascript
Pubnub.subscribe({
    channel  : $scope.selectedChannel,
    message  : $scope.newMessage,
    triggerEvents: ['callback', 'presence']
  });
};

$rootScope.$on(Pubnub.getMessageEventNameFor($scope.selectedChannel), function (ngEvent, message, envelope, channel) {
    $scope.$apply(function () {
        // add message to the messages list
        $scope.chatMessages.unshift(message);
    });
});

$rootScope.$on(Pubnub.getPresenceEventNameFor($scope.selectedChannel), function (ngEvent, pnEvent, envelope, channel) {
    $scope.$apply(function () {
        // apply presence event (join|leave) on users list
        handlePresenceEvent(pnEvent);
    });
});
```

Notice, that params order in broadcasted events is the same as in native SDK, except that ngEvent object is prepended as the first param.

For the required callbacks, for ex. _callback_ callback in subscribe
method, you should add it using one of the next ways:

* _callback_ function in method arguments
* ```triggerEvents: true```
* ```triggerEvents: ['callback']```

## The $pubnubChannel object

The ``$pubnubChannel`` object allows you to seamlessly bind a PubNub channel to a scope variable, which gets automatically updated when there is new realtime data published in that channel. It also lets you interact directely with the channel by calling dedicated methods available into the $scope variable bound to the ``$pubnubChannel`` object.


### Getting started

Init Pubnub:

```javascript
Pubnub.init({
    publish_key: 'your pub key',
    subscribe_key: 'your sub key'
});
```

Inject the ``$pubnubChannel`` service in a controller:

```javascript
.controller('ScoresCtrl', function($scope, $pubnubChannel) { ... });
```

Bind the ``$pubnubChannel`` object to a scope variable providing a channel name and some optional parameters:

```javascript
.controller('ScoresCtrl', function($scope, $pubnubChannel) {

  $scope.scores = $pubnubChannel('game-scores-channel',{ autoload: 50 })

});
```
Instantiating the $pubnubChannel is the only step needed to have a scope variable that reflects the realtime data from a channel.  It subscribes to the channel for you, load initial data if needed and receive new realtime data automatically.

Display the ``$scope.scores`` variable in your view and you will see the data beeing loaded and updated when new data is received in that channel:

```html
<body ng-app="app" ng-controller="ScoresCtrl">
   <ul class="collection">
     <li ng-repeat="score in scores">{{score.player}}<li>
   </ul>
</body>
```

### Optionnal config parameters:

You can pass in some optionnal parameters in the config hash when instantiating the ``$pubnubChannel``:

```javascript
$scope.scores = $pubnubChannel('game-scores-channel', config)
```

*    __autoload: 50__ The number of messages (<100) we want to autoload from history, default: none.
*    __autosubscribe: true__ Automatically subscribe to the channel, default: true
*    __presence: false__  If autosubscribe is enabled, subscribe and trigger the presence events, default: false
*    __autostore: true__ Automatically store the messages received, default: true
*    __instance: 'deluxeInstance'__  The instance that will be used:  default: {default PubNub instance}

### Available methods

You can interact with the ``$pubnubChannel`` via dedicated methods:

```javascript
.controller('ScoresCtrl', function($scope, $pubnubChannel) {

  $scope.scores = $pubnubChannel('game-scores-channel',{ autoload: 20 })
  $scope.scores.$publish({player: 'John', result: 32}) // Publish a message in the game-scores-channel channel.
});
```

Here are some methods you can use:

* __$publish(messages)__   Publish a message into the channel, return a promise which is resolved when the data is published or rejected when there is an error
* __$load(numberOfMessages)__ Load a number of messages from history into the array, return a promise resolved when the data is loaded and rejected if there is an error.
* __$allLoaded()__  Return a boolean to indicate if all the messages from history have been loaded.

### Wraping the ``$pubnubChannel`` object in a Service.

Instead of using the ``$pubnubChannel`` directly in a controller you can wrap it into a Service:

```javascript
app.factory("Scores", ["$pubnubChannel", function($pubnubChannel) {

    var config = {
                    instance: 'myAnotherPubNubInstanceName', // By default, the default PubNub instance
                    autoload: 50 // Autoload the channel with 50 messages (should be < 100)
                 }
    return $pubnubChannel('game-scores-channel', config);
  }
]);
```
And use the Scores service in a controller:

```javascript
app.controller("ScoresCtrl", ["$scope", "Scores", function($scope, Scores) {
  $scope.messages = Scores();
]);
```

### Extending the ``$pubnubChannel`` object

You can also extend the ``$pubnubChannel`` object using the ``$extend`` method in order to add or override methods:

```javascript
angular.module('app')
.factory('Scores', ['$pubnubChannel',function ScoresService($pubnubChannel) {

    // We create an extended $pubnubChannel channel object that add a additionnal sendScore method
    // that publish a score with the name of the player preloaded.
    var Scores = $pubnubChannel.$extend({
      sendScore: function(score) {
         return this.$publish({
                                   player: 'John',
                                   score: score
                              })
         }
    });

   return Scores('game-scores-channel', {autoload: 30});

}]);
```

You can then use the Scores service in a controller:

```javascript
app.controller("ScoresCtrl", ["$scope", "Scores", function($scope, Scores) {
  $scope.scores = Scores();
  $scope.scores.sendScore(34);
]);
```

## The $pubnubChannelGroup object

The ``$pubnubChannelGroup`` provides an easy-to-use interface for channel groups. It stores the incoming messages in containers split by the channel and exposes an interface to directely fetch messages by channel using the ``$channel(channelName)`` method.

### Getting started

Init Pubnub:

```javascript
Pubnub.init({
    publish_key: 'your pub key',
    subscribe_key: 'your sub key'
});
```

Inject the ``$pubnubChannelGroup`` service in a controller:

```javascript
.controller('ChatCtrl', function($scope, $pubnubChannelGroup) { ... });
```

Instantiate a ``$pubnubChannelGroup`` object and assign it to a scope variable providing a channel group name and some optional parameters.

```javascript
.controller('ChatCtrl', function($scope, $pubnubChannelGroup) {

  $scope.Conversations = $pubnubChannelGroup('conversations-channel-group')
  // Fetch a $pubnubChannel from the Conversations $pubnubChannelGroup object
  $scope.currentConversation = $scope.Conversations.$channel('conversation-178')
  // $scope.messages is a $pubnubChannel, you can use any method available for a $pubnubChannel
  $scope.messages.$load(20)
});
```

### Optionnal config parameters:

You can pass in some optionnal parameters in the config hash when instantiating the ``$pubnubChannelGroup``:

```javascript
$scope.Conversation = $pubnubChannelGroup('conversations-channel-group', config)
```

*    __autosubscribe: true__   Automatically subscribe to the channel, default: true
*    __presence: false__  If autosubscribe is enabled, subscribe and trigger the presence events, default: false
*    __instance: 'deluxeInstance'__  The instance that will be used:  default: {default PubNub instance}
*    __channelExtension: {foo: function(){ return "bar"}}__ // Define or override methods for the channels returned when calling $channel on the $channelGroup object.

### Methods available:

* __$channel(channel)__  Return a $pubnubChannel from a the channel group.

### Wraping the ``$pubnubChannelGroup`` object in a Service.

Instead of using the ``$pubnubChannelGroup`` directly in a controller you can wrap it into a Service:

```javascript
app.factory("Conversations", ["$pubnubChannelGroup", function($pubnubChannelGroup) {
    return $pubnubChannelGroup('conversations-channel-group');
  }
]);
```

And use the Conversation service in a controller:

```javascript
app.controller("ChatCtrl", ["$scope", "Conversation", function($scope, Conversation) {
   $scope.currentConversation = Conversations.$channel('conversation-13345');
]);
```

### Extending channels of a $pubnubChannelGroup

When instanciating a ``$pubnubChannelGroup``, you can pass in a ``channelExtension`` parameter that allows you to add or overrides methods for the ``$pubnubChannel`` objects that is returned when calling the ``$channel(channelName)`` method.

```javascript
app.controller("ChatCtrl", ["$scope","$pubnubChannelGroup", function($scope, $pubnubChannelGroup) {

   // We add a sendMessage methods that publish a message with an already defined payload.
   var channelExtension = {
      sendMessage: function(messageContent) {
         return this.$publish({ content: messageContent, sender: "Tomomi" })
      }
   }
	$scope.Conversations = $pubnubChannelGroup('channelGroup', {channelExtension: channelExtension});
	$scope.currentConversation = $scope.Conversations.$channel('conversation-123')
	// Sending a message via the extra method added to the channel.
	$scope.currentConversation.sendMessage('Hello!')

]);
```

## Contributing
To start the development environment  by running `npm install` and `bower install`.
 * `gulp compile` to build the new distributable
 * `gulp test` to execute tests against the distributable
