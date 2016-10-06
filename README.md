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

**Pubnub Angular** service is a wrapper for **PubNub JavaScript SDK** [version 4](https://www.pubnub.com/docs/javascript/pubnub-javascript-sdk-v4) and [version 3](https://www.pubnub.com/docs/web-javascript/pubnub-javascript-sdk)
that adds a few of extra features to simplify Angular integrations:

* [Multiple instance behavior](https://github.com/pubnub/pubnub-angular#differences-in-usage-with-native-javascript-sdk). All instances are accessible
throughout application via ```Pubnub``` service.

* [Events](https://github.com/pubnub/pubnub-angular#events). Delegated methods accept the ```triggerEvents``` option which will broadcast certain callback as an AngularJS event.

* A [$pubnubChannel](https://github.com/pubnub/pubnub-angular#the-pubnubchannel-object) object that seamlessly binds a PubNub channel to a scope variable that gets updated with realtime data and allows you to interact with the channel through dedicated methods.

* A  [$pubnubChannelGroup](https://github.com/pubnub/pubnub-angular#the-pubnubchannelgroup-object) object that provides an easy-to-use interface for channel groups. It stores the incoming messages in containers split by the channel and exposes an interface to directly fetch messages by channel.

You can still use the native PubNub JavaScript SDK if you feel this will be
more suitable for your situation.

## Communication
- If you **need help** or have a **general question**, contact <support@pubnub.com>
- If you **want to contribute**, please open a pull request against the `develop` branch.

## Breaking changes
  * **4.0.0** The AngularJS SDK is compatible with both PubNub JavaScript SDK version 4 and 3. If you want to switch the PubNub Javascript SDK used in your AngularJS application, please take in consideration that the methods, arguments and AngularJS events arguments match those used by the Javascript SDK.

  * **3.0.0** ng* prefix is removed from all the methods and now matches 1:1 to the parent javascript library.


## Integrating PubNub AngularJS SDK into Your App

Your HTML page will include 2 key libraries:

* PubNub JavaScript SDK ( [version 4](https://www.pubnub.com/docs/javascript/pubnub-javascript-sdk-v4) or [version 3](https://www.pubnub.com/docs/web-javascript/pubnub-javascript-sdk) )
* PubNub AngularJS SDK

**1. To install the PubNub AngularJS SDK:**

- Using [Bower](http://bower.io):

```bower install --save pubnub pubnub-angular```

- Using [npm](https://www.npmjs.com/):

```npm install --save pubnub pubnub-angular```

- Or using CDNs:

```html
<script src="http(s)://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-4.0.0.js"></script>
```

- Also available as minified:

```html
<script src="http(s)://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-4.0.0.min.js"></script>
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

In **Pubnub AngularJS SDK** instances
are hidden inside service and are accessible via instance getter.


### Creating a default instance

<table>
<tr><td></td>
    <td>PubNub AngularJS SDK with JS <b>V4</b></td>
	 <td>PubNub AngularJS SDK with JS <b>V3</b></td>
</tr>
<tr>
	<td>Javascript SDK</td>
	<td><pre><code>var defaultInstance = new PubNub({
    publishKey: 'your pub key',
    subscribeKey: 'your sub key'
});</code></pre>
	</td>
	<td><pre><code>var defaultInstance = PUBNUB.init({
    publish_key: 'your pub key',
    subscribe_key: 'your sub key'
});</code></pre>
	</td>
</tr>
<tr>
	<td>PubNub AngularJS SDK</td>
	<td><pre><code>Pubnub.init({
	publishKey: 'your pub key',
	subscribeKey: 'your sub key'
});</code></pre>
	</td>
	<td><pre><code>Pubnub.init({
	publish_key: 'your pub key',
	subscribe_key: 'your sub key'
});</code></pre>
	</td>
</tr>
</table>

### Creating an other instance

In most use cases, usage of the default PubNub instance will be sufficient, but if
 multiple instances with different credentials are needed, the ```Pubnub.getInstance(instanceName)``` getter needs to be utilized.


<table>
<tr><td></td>
    <td>PubNub AngularJS SDK with JS <b>V4</b></td>
	 <td>PubNub AngularJS SDK with JS <b>V3</b></td>
</tr>
<tr>
	<td>PubNub AngularJS SDK</td>
	<td><pre><code>Pubnub.getInstance("another").init({
	publishKey: 'your pub key',
	subscribeKey: 'your sub key'
});</code></pre>
	</td>
	<td><pre><code>Pubnub.getInstance("another").init({
	publish_key: 'your pub key',
	subscribe_key: 'your sub key'
});</code></pre>
	</td>
</tr>
</table>

### Accessing methods

All methods of the Native Javascript SDKs are wrapped within the **Pubnub AngularJS Service**.

- Methods of default instance are mapped directly to PubNub service like ```Pubnub.publish({...})```.
- Methods of the other instances are available via the instance getter like ```Pubnub.getInstance(instanceName).publish()```.

To learn about PubNub JavaScript features and methods available refer to the API Reference of the Javascript SDK that you are using:

* [JavaScript V4 API Reference](https://www.pubnub.com/docs/javascript/api-reference-sdk-v4)
* [JavaScript V3 API Reference](https://https://www.pubnub.com/docs/web-javascript/api-reference)

**Examples:**

<table>
<tr><td></td>
    <td>PubNub AngularJS SDK with JS <b>V4</b></td>
	 <td>PubNub AngularJS SDK with JS <b>V3</b></td>
</tr>
<tr>
	<td>With the default instance</td>
	</td>
	<td><pre><code>Pubnub.publish({
    channel: 'myChannel',
    message: 'Hello!'
  }, function(status, response){
       console.log(response);
});</code></pre>
	</td>
	</td>
	<td><pre><code>Pubnub.publish({
    channel: 'myChannel',
    message: 'Hello!',
    callback: function (m) {console.log(m);},
    error: function (err) {console.log(err);}
});</code></pre>
	</td>
</tr>
<tr>
	<td>With an other instance</td>
</td>
	<td><pre><code>Pubnub.getInstance("another").publish({
    channel: 'myChannel',
    message: 'Hello!'
  }, function(status, response){
       console.log(response);
});</code></pre>
	</td>
	</td>
	<td><pre><code>Pubnub.getInstance("another").publish({
    channel: 'myChannel',
    message: 'Hello!',
    callback: function (m) {console.log(m);}
});</code></pre>
	</td>
</tr>
</table>

That's it - you're ready to start using the AngularJS PubNub SDK!

## Events

Another key feature of this SDK is the ability to trigger method events
in addition to passed in callbacks. By default events will not be triggered.

To enable all possible events for certain method, add ```triggerEvents: true```
option to the method arguments.


### Triggering and listening to events for the subscribe method

* **With PubNub Javascript V4**

With Javascript V4, you can trigger 3 different events (**message**, **presence** and **status**)

**Triggering the events:**

```javascript
Pubnub.subscribe({
    channels  : [$scope.selectedChannel],
    channelGroups: [$scope.selectedChannelGroup],
    withPresence: true,
    triggerEvents: ['message', 'presence', 'status']
  });
};
```
*You can also enable all possible events using* ```triggerEvents: true```

**Listening to a message event of a specific channel or channel group:**

```javascript
$rootScope.$on(Pubnub.getMessageEventNameFor($scope.selectedChannel), function (ngEvent, envelope) {
    $scope.$apply(function () {
        // add message to the messages list
        $scope.chatMessages.unshift(envelope.message);
    });
});
```

**Listening to a presence event of a specific channel or channel group:**


```javascript
$rootScope.$on(Pubnub.getPresenceEventNameFor($scope.selectedChannel), function (ngEvent, pnEvent) {
        // apply presence event (join|leave) on users list
        handlePresenceEvent(pnEvent);
});
```

**Listening to the global status events:**

Via the status listener, you can receive different events such as when the network is online (PNNetworkUpCategory), when the SDK is connected to a set of channels (PNConnectedCategory), etc... See the list of events available in the [API Reference](https://www.pubnub.com/docs/javascript/api-reference-sdk-v4#listeners-categories)

```javascript
$rootScope.$on(Pubnub.getEventNameFor('subscribe', 'status'), function (ngEvent, status, response) {
    if (status.category == 'PNConnectedCategory'){
        console.log('successfully connected to channels', response);
    }
});
```

* **With PubNub Javascript V3**

With PubNub Javascript V3, you can trigger 6 different events (**callback**, **connect**, **reconnect**,**disconnect**, **error**, **presence**)

**Triggering the events:**

```javascript
Pubnub.subscribe({
    channel  : $scope.selectedChannel,
    channel_group: $scope.selectedChannelGroup,
    triggerEvents: ['callback', 'presence', 'connect', 'reconnect', 'disconnect', 'error']
  });
};
```
*You can also enable all possible events using* ```triggerEvents: true```

**Listening to a message event of a specific channel or channel group:**

```javascript
$rootScope.$on(Pubnub.getMessageEventNameFor($scope.selectedChannel), function (ngEvent, message, envelope, channel) {
        // add message to the messages list
        $scope.chatMessages.unshift(message);
});
```

**Listening to a presence event of a specific channel or channel group:**


```javascript
$rootScope.$on(Pubnub.getPresenceEventNameFor($scope.selectedChannel), function (ngEvent, pnEvent, envelope, channel) {
     // apply presence event (join|leave) on users list
     handlePresenceEvent(pnEvent);
});
```

**Listening to the other events** (**connect**, **reconnect**, **disconnect** and **error**)


```javascript
$rootScope.$on(Pubnub.getEventNameFor('subscribe', 'connect'), function (ngEvent, payload) {
        $scope.statusSentSuccessfully = true;
});
```

And so on for the **connect**, **reconnect**, **disconnect** and **error** event.


### Triggering and listening to events for the methods with callbacks

You have the possibility to trigger events for the methods with callbacks.

For the required callbacks, for ex. the _callback_ called callback in the publish
method, you should add it using one of the following ways:

* _callback_ function in method arguments
* ```triggerEvents: ['callback']```
* ```triggerEvents: true``` (will trigger all the events of the method)


**Triggering the events:**

<table>
<tr><td></td>
    <td>PubNub AngularJS SDK with JS <b>v4</b></td>
	 <td>PubNub AngularJS SDK with JS <b>v3</b></td>
</tr>
<tr>
	<td>Method with callbacks as argument</td>
	</td>
	<td><pre><code>Pubnub.publish({
    channel: 'myChannel',
    message: 'Hello!'
  }, function(status, response){
       console.log(response);
});</code></pre>
	</td>
	</td>
	<td><pre><code>Pubnub.publish({
    channel: 'myChannel',
    message: 'Hello!',
    callback: function (m) {console.log(m);},
    error: function(err) {console.log(err);}
});</code></pre>
	</td>
</tr>
<tr>
	<td>Method with events triggered</td>
	</td>
	<td><pre><code>Pubnub.publish({
    channel: 'myChannel',
    message: 'Hello!',
    triggerEvents: ['callback']
  }</code></pre>
	</td>
	</td>
	<td><pre><code>Pubnub.publish({
    channel: 'myChannel',
    message: 'Hello!',
    triggerEvents: ['callback', 'error']
});</code></pre>
	</td>
</tr>
</table>

**Listening to the events:**

You can listen to the events that have been triggered using the ```Pubnub.getEventNameFor(...)```
helper from anywhere in your app.
Params order in broadcasted events is the same as in native SDK methods, except that ngEvent object is prepended as the first param.

* **With JS V4**

With JS V4 the *callback* event will be triggered for both successful and unsuccesfull response:

```javascript
$rootScope.$on(Pubnub.getEventNameFor('publish', 'callback'),
  function (ngEvent, status, response) {
    $scope.$apply(function () {
	    if (status.error){
	       $scope.statusSentSuccessfully = false;
	    } else {
	       $scope.statusSentSuccessfully = true;
	    }
	 })
});
```

* **With JS V3**

With JS V3 you will get the successful and unsuccessful responses as two separate events (*callback* and *error*):

```javascript
$rootScope.$on(Pubnub.getEventNameFor('publish', 'callback'),
  function (ngEvent, payload) {
    $scope.$apply(function () {
        $scope.statusSentSuccessfully = true;
    });
});
```

```javascript
$rootScope.$on(Pubnub.getEventNameFor('publish', 'error'),
  function (ngEvent, payload) {
    $scope.$apply(function () {
        $scope.statusSentSuccessfully = false;
    });
});
```


## The $pubnubChannel object

The ``$pubnubChannel`` object allows you to seamlessly bind a PubNub channel to a scope variable, which gets automatically updated when there is new realtime data published in that channel. It also lets you interact directly with the channel by calling dedicated methods available into the $scope variable bound to the ``$pubnubChannel`` object.


### Getting started

Init Pubnub:

<table>
<tr>
    <td>With JS <b>V4</b></td>
	 <td>With JS <b>V3</b></td>
</tr>
<tr>
	<td><pre><code>Pubnub.init({
	publishKey: 'your pub key',
	subscribeKey: 'your sub key'
});</code></pre>
	</td>
	<td><pre><code>Pubnub.init({
	publish_key: 'your pub key',
	subscribe_key: 'your sub key'
});</code></pre>
	</td>
</tr>
</table>

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

### Optional config parameters:

You can pass in some optional parameters in the config hash when instantiating the ``$pubnubChannel``:

```javascript
$scope.scores = $pubnubChannel('game-scores-channel', config)
```

*    __autoload: 50__ The number of messages (<100) we want to autoload from history, default: none.
*    __autosubscribe: true__ Automatically subscribe to the channel, default: true
*    __presence: false__  If autosubscribe is enabled, subscribe and trigger the presence events, default: false
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

### Wrapping the ``$pubnubChannel`` object in a Service.

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

The ``$pubnubChannelGroup`` provides an easy-to-use interface for channel groups. It stores the incoming messages in containers split by the channel and exposes an interface to directly fetch messages by channel using the ``$channel(channelName)`` method.

### Getting started

Init Pubnub:

<table>
<tr>
    <td>With JS <b>V4</b></td>
	 <td>With JS <b>V3</b></td>
</tr>
<tr>
	<td><pre><code>Pubnub.init({
	publishKey: 'your pub key',
	subscribeKey: 'your sub key'
});</code></pre>
	</td>
	<td><pre><code>Pubnub.init({
	publish_key: 'your pub key',
	subscribe_key: 'your sub key'
});</code></pre>
	</td>
</tr>
</table>

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
  $scope.currentConversation.$load(20)
});
```

### Optional config parameters:

You can pass in some optional parameters in the config hash when instantiating the ``$pubnubChannelGroup``:

```javascript
$scope.Conversation = $pubnubChannelGroup('conversations-channel-group', config)
```

*    __autosubscribe: true__   Automatically subscribe to the channel, default: true
*    __presence: false__  If autosubscribe is enabled, subscribe and trigger the presence events, default: false
*    __instance: 'deluxeInstance'__  The instance that will be used:  default: {default PubNub instance}
*    __channelExtension: {foo: function(){ return "bar"}}__ // Define or override methods for the channels returned when calling $channel on the $channelGroup object.

### Methods available:

* __$channel(channel)__  Return a $pubnubChannel object which is containing the messages received via the channel group

### Wrapping the ``$pubnubChannelGroup`` object in a Service.

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
