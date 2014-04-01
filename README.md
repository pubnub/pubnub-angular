# PubNub AngularJS SDK

Welcome! We're here to get you started quickly with your
integration between PubNub and AngularJS. PubNub makes it
easy to integrate real-time bidirectional communication
into your app.

# Getting the PubNub Angular SDK into Your App

Your HTML page will include 3 key libraries:

* The core PubNub JS Library (generally from the CDN)
* AngularJS (usually as a Bower component)
* PubNub Angular (as a Bower component or copy&paste)

The HTML code looks like this:

```html
<script src="http://cdn.pubnub.com/pubnub.min.js"></script>
<script src="components/angular/angular.js"></script>
<script src="components/pubnub-angular/pubnub-angular.js"></script>
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

The Angular ```PubNub``` service is injected into the controller as follows:

```javascript
.controller('JoinCtrl', function($scope, PubNub) { ... });
```

That's it - you're ready to start using the AngularJS PubNub SDK!


# Here's How to Use It

Publishing to channels is trivial:

```javascript
$scope.publish = function() {
  PubNub.ngPublish({
    channel: $scope.selectedChannel,
    message: $scope.newMessage
  });
};
```

We call the PubNub publish method passing in the selected channel
and the message to transmit. You can also transmit structured
data as JSON objects which will be automatically serialized &
deserialized by the PubNub library.

Subscribing to channels is accomplished by calling the PubNub
ngSubscribe method. After the channel is subscribed, the app can
register root scope message events by calling $rootScope.$on with
the event string returned by PubNub.ngMsgEv(channel).

```javascript
$scope.subscribe = function() {
  ...
  PubNub.ngSubscribe({ channel: theChannel })
  ...
  $rootScope.$on(PubNub.ngMsgEv(theChannel), function(event, payload) {
    // payload contains message, channel, env...
    console.log('got a message event:', payload);    
  })
  ...
  $rootScope.$on(PubNub.ngPrsEv(theChannel), function(event, payload) {
    // payload contains message, channel, env...
    console.log('got a presence event:', payload);
  })
```

Note - if you'd like, you can also provide a callback to receive events
as part of your ```ngSubscribe``` call as follows:

```javascript
    PubNub.ngSubscribe({
      channel: theChannel,
      callback: function() { console.log(arguments); }
    })
```

Under the hood, the AngularJS SDK will wrap your callback and invoke
it. Why do we wrap it? So that we can provide all the goodness of the
Presence API - see the next sections for more info!

This is the core of the PubNub API - allowing clients to subscribe and
publish to channels, and have those events propagate in real-time to other
applications connected to the same channels.


# Integrating Presence Events

It's also easy to integrate presence events using the Angular API. In
the example above, we just add an additional couple lines of code to
call the PubNub.ngHereNow() method (retrieve current users), and register
for presence events by calling $rootScope.$on with the event string
returned by PubNub.ngPrsEv(channel).

```javascript
$scope.subscribe = function() {
  ...
  // subscribe to the channel
  PubNub.ngSubscribe({ channel: theChannel })
  // handle message events
  $rootScope.$on(PubNub.ngMsgEv(theChannel), function(event, payload) { ... })
  ...
  // handle presence events
  $rootScope.$on(PubNub.ngPrsEv(theChannel), function(event, payload) {
    // payload contains message, channel, env...
    console.log('got a presence event:', payload);
  })

  // obtain the list of current channel subscribers
  PubNub.ngHereNow { channel: theChannel }
```

Using the presence event as a trigger, we retrieve the Presence
list for a channel using the PubNub.ngListPresence() function.

```javascript
  $rootScope.$on(PubNub.ngPrsEv(theChannel), function(event, payload) {
    $scope.users = PubNub.ngListPresence(theChannel);
  })
```


# Retrieving History

It can be super-handy to gather the previous several hundred messages
from the PubNub channel history. The PubNub Angular API makes this easy
by bridging the event model of the PubNub JS history API and the AngularJS
event broadcast model so that historical messages come through the same
event interface.

```javascript
  PubNub.ngHistory({channel:theChannel, count:500});
  // messages will be broadcast via $rootScope...
```


# Listing & Unsubscribing from Channels

The PubNub Angular API takes care of keeping track of currently subscribed
channels. Call the PubNub.ngListChannels() method to return a list of presently
subscribed channels.

```javascript
  $scope.channels = PubNub.ngListChannels()
```

Unsubscribing is as easy as calling the PubNub.ngUnsubscribe() method. The
library even takes care of removing the Angular event handlers for you to
prevent memory leaks!

```javascript
  PubNub.ngUnsubscribe({channel:theChannel})
```

