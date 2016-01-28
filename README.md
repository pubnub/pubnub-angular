# PubNub AngularJS SDK

[![Build Status](https://travis-ci.org/pubnub/pubnub-angular.svg?branch=master)](https://travis-ci.org/pubnub/pubnub-angular)

Welcome! We're here to get you started quickly with your
integration between PubNub and AngularJS. PubNub makes it
easy to integrate real-time bidirectional communication
into your app.

**Pubnub** service is a wrapper for Pubnub JavaScript SDK
that adds a few of extra features to simplify it's usage with AngularJS:

* Multiple instance behaviour. All instances are accessible
throughout application via ```Pubnub``` service.

* Events. For every PubNub method method you can specify ```triggerEvents```
option, that will broadcast certain callback as an AngularJS event.

You can still use the native Pubnub JavaScript SDK if you feel this will be
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
<script src="http(s)://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-3.1.1.js"></script>
```

Also available as minified:

```html
<script src="http(s)://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-3.1.1.min.js"></script>
```

To utilize this wrapper, include the scripts in the following order:
```html
  <script src="(angular.js)"></script>
  <script src="(latest version of pubnub JS SDK from https://github.com/pubnub/javascript)"></script>
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

To learn about Pubnub JavaScript features refer to native
[Pubnub JavaScript SDK manual](http://www.pubnub.com/docs/javascript/javascript-sdk.html).
All methods of this SDK are wrapped with **Pubnub AngularJS Service**.

Native **Pubnub JavaScript SDK** provides instance creation using ```PUBNUB.init()```,
which returns new instance with given credentials. In **Pubnub Angular SDK** instances
are hidden inside service and are accessible via instance getter. Methods of default
instance are mapped directly to Pubnub service just like ```Pubnub.publish({...})```.
In most use cases usage of the only default Pubnub instance will be enough, but if you
need multiple instances with different credentials, you should
use ```Pubnub.getInstance(instanceName)``` getter. In this case publish
method will looks like ```Pubnub.getInstance(instanceName).publish({})```.

To summarize above let's check out the following 2 examples. Both of them performs the
same job - creation of  2 Pubnub instances with different credentials.
Publish method is invoked on the __defaultInstance__ and grant method on __anotherInstance__.

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

For *subscribe* method there are two helpers that provide you handlers
for specific channel events:

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


## Contributing

To start the development environment  by running `npm install` and `bower install`. 
 * `grunt compile` to build the new distributable
 * `grunt test` to execute tests against the distributable
