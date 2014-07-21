# Strict mode catches some errors, prevents unsafe actions from being taken, and throws errors.
'use strict'

# Set up an Angular [module](https://docs.angularjs.org/guide/module). Notice the [dependency](https://docs.angularjs.org/guide/di) on the PubNub Angular library.
angular.module('pubnub.angular.service', [])
  # Set up a factory. See more on [$rootScope](https://docs.angularjs.org/api/ng/service/$rootScope).
  .factory 'PubNub', ['$rootScope', ($rootScope) ->
    # Initialize an instance object. Set the default version, instance, channels, presense, and jsapi.
    c = {
      # The current working version of the PubNub Angular library
      'VERSION'   : '1.1.0'
      # A reference to the PubNub vanilla JavaScript API object
      '_instance' : null
      # The list of channels that we currently know about
      '_channels' : []
      # The map of channel name to channel members that we currently know about
      '_presence' : {}
      # A map references to the vanilla JavaScript API functions for advanced client usage
      'jsapi'       : {}
    }

    # Helper methods. Include the "map" and "each" functions into the PubNub Angular API.
    # We need to create and invoke a closure so that we can get both "c" and the method name "k" into the function.
    for k in ['map', 'each']
      if PUBNUB?[k] instanceof Function
        ((kk) -> c[kk] = ->
          c['_instance']?[kk].apply c['_instance'], arguments)(k)

    # Add bindings to the original vanilla JavaScript PubNub API methods under the "jsapi" key.
    # We need to create and invoke a closure so that we can get both "c" and the method name "k" into the function.
    for k of PUBNUB
      if PUBNUB?[k] instanceof Function
        ((kk) -> c['jsapi'][kk] = ->
          c['_instance']?[kk].apply c['_instance'], arguments)(k)

    # Add a field so that clients can tell the library has been initialized.
    c.initialized = -> !!c['_instance']

    # [Initialize](http://www.pubnub.com/docs/javascript/api/reference.html#init) the PubNub Client API. You must do this before trying to use the API as it establishes account credentials.
    c.init = ->
      c['_instance'] = PUBNUB.init.apply PUBNUB, arguments
      c['_channels'] = []
      c['_presence'] = {}
      c['_presData'] = {}
      c['_instance']

    # Destroy the PubNub Angular library state. This is currently partial and best-effort because the vanilla PubNub library does not have a destroy method.
    c.destroy = ->
      c['_instance'] = null
      c['_channels'] = null
      c['_presence'] = null
      c['_presData'] = null

    # Internal method that creates a message handler for a specified channel name.
    c._ngFireMessages = (realChannel) ->
      (messages, t1, t2) ->
        c.each messages[0], (message) ->
          $rootScope.$broadcast "pn-message:#{realChannel}", {
            message: message
            channel: realChannel
          }

    # Internal method that creates wrappers for the message and presence event handlers. This is necessary because we want the Angular library to keep track of channels and presence events.
    c._ngInstallHandlers = (args) ->
      oldmessage = args.message
      # Create a message handler wrapper that broadcasts the message event and calls the original user-provided message handler.
      args.message = ->
        $rootScope.$broadcast c.ngMsgEv(args.channel), {
          message: arguments[0],
          env: arguments[1],
          channel: args.channel
        }
        oldmessage(arguments) if oldmessage

      # Create a presence handler wrapper that broadcasts the presence event and calls the original user-provided presence handler.
      oldpresence = args.presence
      args.presence = ->
        event = arguments[0]
        channel = args.channel
        if event.uuids
          c.each event.uuids, (uuid) ->
            state = if uuid.state then uuid.state else null
            uuid  = if uuid.uuid  then uuid.uuid else uuid
            c['_presence'][channel] ||= []
            c['_presence'][channel].push uuid if c['_presence'][channel].indexOf(uuid) < 0
            c['_presData'][channel] ||= {}
            c['_presData'][channel][uuid] = state if state
        else
          if event.uuid && event.action
            c['_presence'][channel] ||= []
            c['_presData'][channel] ||= {}
            if event.action == 'leave'
              cpos = c['_presence'][channel].indexOf event.uuid
              c['_presence'][channel].splice cpos, 1 if cpos != -1
              delete c['_presData'][channel][event.uuid]
            else
              c['_presence'][channel].push event.uuid if c['_presence'][channel].indexOf(event.uuid) < 0
              c['_presData'][channel][event.uuid] = event.data if event.data

        $rootScope.$broadcast c.ngPrsEv(args.channel), {
          event: event,
          message: arguments[1],
          channel: channel
        }
        oldpresence(arguments) if oldpresence

      args

    # The PubNub Angular API takes care of keeping track of currently subscribed channels. Call the `PubNub.ngListChannels()` method to return a list of presently subscribed channels.
    c.ngListChannels  = ->
      c['_channels'].slice 0

    # The PubNub Angular API takes care of keeping track of channel presence information. Call the `PubNub.ngListPresence(channel)` method to return a list of presently subscribed users in the specified channel.
    c.ngListPresence = (channel) ->
      c['_presence'][channel]?.slice 0

    # It's also possible to retrieve the extended Presence state data for a channel using the `PubNub.ngPresenceData(channel)` function.
    c.ngPresenceData = (channel) -> c['_presData'][channel] || {}

    # Subscribing to channels is accomplished by calling the PubNub [`ngSubscribe`](http://www.pubnub.com/docs/javascript/api/reference.html#subscribe) method. After the channel is subscribed, the app can reigster root scope message events by calling `$rootScope.$on` with the event string returned by `PubNub.ngMsgEv(channel)`.
    c.ngSubscribe = (args) ->
      c['_channels'].push args.channel if c['_channels'].indexOf(args.channel) < 0
      c['_presence'][args.channel] ||= []
      args = c._ngInstallHandlers args
      c.jsapi.subscribe(args)

    # Unsubscribing is as easy as calling the [`PubNub.ngUnsubscribe()`](http://www.pubnub.com/docs/javascript/api/reference.html#unsubscribe) method. The library even takes care of removing the Angular event handlers for you to prevent unsightly memory leaks!
    c.ngUnsubscribe = (args) ->
      cpos = c['_channels'].indexOf(args.channel)
      c['_channels'].splice cpos, 1 if cpos != -1
      c['_presence'][args.channel] = null
      delete $rootScope.$$listeners[c.ngMsgEv(args.channel)]
      delete $rootScope.$$listeners[c.ngPrsEv(args.channel)]
      c.jsapi.unsubscribe(args)

    # Publishing to channels is trivial - just use the [`PubNub.ngPublish()`](http://www.pubnub.com/docs/javascript/api/reference.html#publish) method.
    c.ngPublish = -> c['_instance']['publish'].apply c['_instance'], arguments

    # It can be super-handy to gather the previous several hundred messages from the PubNub channel [history](http://www.pubnub.com/docs/javascript/api/reference.html#history). The PubNub Angular API makes this easy by bridging the event model of the PubNub JS history API and the AngularJS event broadcast model so that historical messages come through the same event interface.
    c.ngHistory = (args) ->
      args.callback = c._ngFireMessages args.channel
      c.jsapi.history args

    # It's also easy to integrate presence events using the Angular API. In the example above, we just add an additional couple lines of code to call the [`PubNub.ngHereNow()`](http://www.pubnub.com/docs/javascript/api/reference.html#here_now) method (retrieve current users).
    c.ngHereNow = (args) ->
      args = c._ngInstallHandlers(args)
      args.state = true
      args.callback = args.presence
      delete args.presence
      delete args.message
      c.jsapi.here_now(args)

    # You can obtain information about the current list of a channels to which a uuid is subscribed to by calling the `ngWhereNow()` function in your application. [More info on ngWhereNow](http://www.pubnub.com/docs/javascript/api/reference.html#where_now).
    c.ngWhereNow = (args) -> c.jsapi.where_now(args)

    # You can obtain information about the current metadata associated with a uuid by calling the `ngState()` function in your application. [More info on ngState](http://www.pubnub.com/docs/javascript/api/reference.html#state).
    c.ngState    = (args) -> c.jsapi.state(args)

    # The method `ngMsgEv` returns the root scope broadcast event name for message events for a given channel.
    c.ngMsgEv = (channel) -> "pn-message:#{channel}"

    # The method `ngPrsEv` returns the root scope broadcast event name for presence events for a given channel.
    c.ngPrsEv = (channel) -> "pn-presence:#{channel}"

    # The method [`ngAuth`](http://www.pubnub.com/docs/javascript/api/reference.html#auth) updates the auth_key associated with the PubNub session
    c.ngAuth   = -> c['_instance']['auth'].apply c['_instance'], arguments

    # Often times, it's desirable to lock down applications and channels. With PAM (PubNub Access Manager), it's easy. There are 2 calls: [`ngGrant`](http://www.pubnub.com/docs/javascript/api/reference.html#grant) which grants access for users having a specified auth key, and [`ngAudit`](http://www.pubnub.com/docs/javascript/api/reference.html#audit) which returns the current policy configuration. Note: to perform access control operations, the PubNub client must be initialized with the secret key (which should always be protected by server-only access).
    c.ngAudit  = -> c['_instance']['audit'].apply c['_instance'], arguments
    c.ngGrant  = -> c['_instance']['grant'].apply c['_instance'], arguments

    c
  ]
