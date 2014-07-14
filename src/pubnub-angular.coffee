# Strict mode catches some errors, prevents unsafe actions from being taken, and throws errors.
'use strict'

# Set up an Angular module. Notice the dependency on the PubNub Angular library.
angular.module('pubnub.angular.service', [])
  .factory 'PubNub', ['$rootScope', ($rootScope) ->
    # Initialize an instance object.
    c = {
      'VERSION'   : '1.1.0'
      '_instance' : null
      '_channels' : []
      '_presence' : {}
      'jsapi'       : {}
    }

    # Helper methods.
    for k in ['map', 'each']
      if PUBNUB?[k] instanceof Function
        ((kk) -> c[kk] = ->
          c['_instance']?[kk].apply c['_instance'], arguments)(k)

    # Core (original) PubNub API methods.
    for k of PUBNUB
      if PUBNUB?[k] instanceof Function
        ((kk) -> c['jsapi'][kk] = ->
          c['_instance']?[kk].apply c['_instance'], arguments)(k)

    c.initialized = -> !!c['_instance']

    # Initialize the instance with PubNub Angular API with specified values.
    c.init = ->
      c['_instance'] = PUBNUB.init.apply PUBNUB, arguments
      c['_channels'] = []
      c['_presence'] = {}
      c['_presData'] = {}
      c['_instance']

    # Destroy an instance's specified values.
    c.destroy = ->
      c['_instance'] = null
      c['_channels'] = null
      c['_presence'] = null
      c['_presData'] = null
      \* TODO - destroy PUBNUB instance & reset memory. *\

    # Specify how to broadcast messages.
    c._ngFireMessages = (realChannel) ->
      (messages, t1, t2) ->
        c.each messages[0], (message) ->
          $rootScope.$broadcast "pn-message:#{realChannel}", {
            message: message
            channel: realChannel
          }

    # Specify the details of message and presence arguments.
    c._ngInstallHandlers = (args) ->
      oldmessage = args.message
      # Message arguments.
      args.message = ->
        $rootScope.$broadcast c.ngMsgEv(args.channel), {
          message: arguments[0],
          env: arguments[1],
          channel: args.channel
        }
        oldmessage(arguments) if oldmessage

      # Presence arguments.
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

    # Using the presence event as a trigger, we retrieve the Presence list for a channel using the `PubNub.ngListPresence(channel)` function.
    c.ngListPresence = (channel) ->
      c['_presence'][channel]?.slice 0

    # It's also possible to retrieve the extended Presence state data for a channel using the `PubNub.ngPresenceData(channel)` function.
    c.ngPresenceData = (channel) -> c['_presData'][channel] || {}

    # Subscribing to channels is accomplished by calling the PubNub `ngSubscribe` method. After the channel is subscribed, the app can reigster root scope message events by calling `$rootScope.$on` with the event string returned by `PubNub.ngMsgEv(channel)`.
    c.ngSubscribe = (args) ->
      c['_channels'].push args.channel if c['_channels'].indexOf(args.channel) < 0
      c['_presence'][args.channel] ||= []
      args = c._ngInstallHandlers args
      c.jsapi.subscribe(args)

    # Unsubscribing is as easy as calling the `PubNub.ngUnsubscribe()` method. The library even takes care of removing the Angular event handlers for you to prevent unsightly memory leaks!
    c.ngUnsubscribe = (args) ->
      cpos = c['_channels'].indexOf(args.channel)
      c['_channels'].splice cpos, 1 if cpos != -1
      c['_presence'][args.channel] = null
      delete $rootScope.$$listeners[c.ngMsgEv(args.channel)]
      delete $rootScope.$$listeners[c.ngPrsEv(args.channel)]
      c.jsapi.unsubscribe(args)

    # Publishing to channels is trivial - just use the `PubNub.ngPublish()` method.
    c.ngPublish = -> c['_instance']['publish'].apply c['_instance'], arguments

    # It can be super-handy to gather the previous several hundred messages from the PubNub channel history. The PubNub Angular API makes this easy by bridging the event model of the PubNub JS history API and the AngularJS event broadcast model so that historical messages come through the same event interface.
    c.ngHistory = (args) ->
      args.callback = c._ngFireMessages args.channel
      c.jsapi.history args

    # It's also easy to integrate presence events using the Angular API. In the example above, we just add an additional couple lines of code to call the `PubNub.ngHereNow()` method (retrieve current users).
    c.ngHereNow = (args) ->
      args = c._ngInstallHandlers(args)
      args.state = true
      args.callback = args.presence
      delete args.presence
      delete args.message
      c.jsapi.here_now(args)

    # Register for presence events by calling `$rootScope.$on` with the event string returned by `PubNub.ngPrsEv(channel)`.
    c.ngWhereNow = (args) -> c.jsapi.where_now(args)

    # The method `ngState` retrieves extended user state for a channel.
    c.ngState    = (args) -> c.jsapi.state(args)

    # The method `ngMsgEv` returns the root scope broadcast event name for message events for a given channel.
    c.ngMsgEv = (channel) -> "pn-message:#{channel}"

    # The method `ngPrsEv` returns the root scope broadcast event name for presence events for a given channel.
    c.ngPrsEv = (channel) -> "pn-presence:#{channel}"

    # The method `ngAuth` updates the auth_key associated with the PubNub session
    c.ngAuth   = -> c['_instance']['auth'].apply c['_instance'], arguments

    # Often times, it's desirable to lock down applications and channels. With PAM (PubNub Access Manager), it's easy. There are 2 calls: `ngGrant` which grants access for users having a specified auth key, and `ngAudit` which returns the current policy configuration. Note: to perform access control operations, the PubNub client must be initialized with the secret key (which should always be protected by server-only access).
    c.ngAudit  = -> c['_instance']['audit'].apply c['_instance'], arguments
    c.ngGrant  = -> c['_instance']['grant'].apply c['_instance'], arguments

    c
  ]
