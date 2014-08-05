# Annotated Source Code for the PubNub AngularJS library.
# Welcome! Thank you for reading this documentation - if you have any feedback or suggestions, please file a GitHub issue and we'll take a look right away!
# 
# Using this library should be as easy as:
#
# 1. Install the library using `bower install pubnub-angular`
# 2. Include the JS libraries for pubnub and pubnub-angular into your HTML using SCRIPT tags
# 3. Declare a dependency on "pubnub.angular.service" in your application's Angular module
# 4. Inject the PubNub service object into your AngularJS services and controllers as you see fit!
#
# For step-by-step instructions, check out https://github.com/pubnub/pubnub-angular/blob/master/README.md
#

# We love strict mode.
'use strict'

# Set up an Angular [module](https://docs.angularjs.org/guide/module). Notice the identifier `pubnub.angular.service`, used when declaring a [dependency](https://docs.angularjs.org/guide/di) on the PubNub Angular library.
angular.module('pubnub.angular.service', [])
  # Set up a factory for injecting a `PubNub` service into your Angular Controller or Service. Depends on the Angular [$rootScope](https://docs.angularjs.org/api/ng/service/$rootScope) so that the PubNub object is persistent across controller instantiations.
  .factory 'PubNub', ['$rootScope', '$q', '$timeout', ($rootScope, $q, $timeout) ->
    # Initialize an object for the PubNub service's data. Set the current version, instance, channels, presence, and jsapi for advanced access.
    c = {
      # Our current version of this PubNub Angular library
      'VERSION'   : '1.2.0-beta.1'
      # A reference to the PubNub vanilla JavaScript API object (aka PUBNUB from https://github.com/pubnub/javascript/blob/master/web/pubnub.js)
      '_instance' : null
      # The list of channels that we currently know about
      '_channels' : []
      # A map of channel name to channel members that we currently know about
      '_presence' : {}
      # A map of references to vanilla JavaScript API functions for advanced client usage
      'jsapi'       : {}
    }

    # Include the "map" and "each" functions into the PubNub Angular API as helper functions.
    # We create and invoke a closure to capture both the angular context method name into the helper function.
    for k in ['map', 'each']
      if PUBNUB?[k] instanceof Function
        ((kk) -> c[kk] = ->
          c['_instance']?[kk].apply c['_instance'], arguments)(k)

    # Add bindings to the original vanilla JavaScript PubNub API methods under the "jsapi" key.
    # We create and invoke a closure to capture both the angular context method name into the helper function.
    for k of PUBNUB
      if PUBNUB?[k] instanceof Function
        ((kk) -> c['jsapi'][kk] = ->
          c['_instance']?[kk].apply c['_instance'], arguments)(k)

    # Add a field so that clients can tell the library has been initialized.
    c.initialized = -> !!c['_instance']

    # [Initialize](http://www.pubnub.com/docs/javascript/api/reference.html#init) the PubNub Client API. You must do this before trying to use the API to establish account credentials. Overwrites the current state, so this method should only be called once when instantiating an Angular application.
    c.init = ->
      c['_instance'] = PUBNUB.init.apply PUBNUB, arguments
      c['_channels'] = []
      c['_presence'] = {}
      c['_presData'] = {}
      c['_instance']

    # Destroy the PubNub Angular library state. This is currently partial / best-effort because the vanilla PubNub library does not have a destroy method yet.
    c.destroy = ->
      c['_instance'] = null
      c['_channels'] = null
      c['_presence'] = null
      c['_presData'] = null
      # TODO - destroy PUBNUB instance & reset memory using PUBNUB's destroy method when it's available.

    # Internal method that creates a message handler for a specified channel name. Uses a closure so that we capture the channel name within the message handler callback.
    c._ngFireMessages = (realChannel) ->
      (messages, t1, t2) ->
        c.each messages[0], (message) ->
          $rootScope.$broadcast "pn-message:#{realChannel}", {
            message: message
            channel: realChannel
          }

    # Internal method that creates wrappers for the message and presence event handlers. Wrappers are necessary because we want the Angular library to keep track of channels and presence events on the application's behalf.
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
        # We must handle two sources of presence data: `here_now` and `presence` events. The `here_now` events include a `uuids` field. Normal `presence` events have a `uuid` field and an `action` field (join or leave).
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

    # The PubNub Angular API takes care of keeping track of channel presence information. Call the `PubNub.ngListPresence(channel)` method to return a list of presently subscribed user uuids in the specified channel.
    c.ngListPresence = (channel) ->
      c['_presence'][channel]?.slice 0

    # It's also possible to retrieve the extended Presence state data for users in a channel using the `PubNub.ngPresenceData(channel)` function. Returns a map of UUID to state data.
    c.ngPresenceData = (channel) -> c['_presData'][channel] || {}

    # Subscribing to channels is accomplished by calling the PubNub [`ngSubscribe`](http://www.pubnub.com/docs/javascript/api/reference.html#subscribe) method. After the channel is subscribed, the app can register root scope message events by calling `$rootScope.$on` with the event string returned by `PubNub.ngMsgEv(channel)`.
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

    # It's also easy to integrate presence events using the Angular API. In the example above, we just add an additional couple lines of code to call the [`PubNub.ngHereNow()`](http://www.pubnub.com/docs/javascript/api/reference.html#here_now) method (retrieve current users in a channel).
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

    # Each channel has a unique "message event name" for message events. The method `ngMsgEv(channel)` returns that broadcast event name for message events for a given channel as they are broadcast via `$rootScope`.
    c.ngMsgEv = (channel) -> "pn-message:#{channel}"

    # Each channel has a unique "presence event name" for presence events. The method `ngPrsEv(channel)` returns that broadcast event name for presence events for a given channel as they are broadcast via `$rootScope`.
    c.ngPrsEv = (channel) -> "pn-presence:#{channel}"

    # The method [`ngAuth`](http://www.pubnub.com/docs/javascript/api/reference.html#auth) updates the auth_key associated with the PubNub session.
    c.ngAuth   = -> c['_instance']['auth'].apply c['_instance'], arguments

    # Often times, it's desirable to lock down applications and channels. With PAM (PubNub Access Manager), it's easy. There are 2 calls: [`ngGrant`](http://www.pubnub.com/docs/javascript/api/reference.html#grant) which grants access for users having a specified auth key, and [`ngAudit`](http://www.pubnub.com/docs/javascript/api/reference.html#audit) which returns the current policy configuration. Note: to perform access control operations, the PubNub client must be initialized with the secret key (which should always be protected by server-only access).
    c.ngAudit  = -> c['_instance']['audit'].apply c['_instance'], arguments
    c.ngGrant  = -> c['_instance']['grant'].apply c['_instance'], arguments

    # PubNub DataSync BETA
    c.datasync_BETA = {}

    _makeDataSyncOperation = (op) -> (args) ->
      return unless args && args['object_id']
      deferred = $q.defer()
      oldcallback = args.callback
      args.callback = (x) ->
        deferred.resolve(x)
        $rootScope.$apply()
        oldcallback(x) if oldcallback
      args.error = (x) ->
        deferred.reject(x)
      c['jsapi'][op].apply c['_instance'], [args]
      deferred.promise

    # PubNub DataSync BETA: Get Object. Returns a $q promise
    c.datasync_BETA.ngGet = _makeDataSyncOperation('get')
    # PubNub DataSync BETA: Set Object. Returns a $q promise
    c.datasync_BETA.ngSet = _makeDataSyncOperation('set')
    # PubNub DataSync BETA: Merge Object. Returns a $q promise
    c.datasync_BETA.ngMerge = _makeDataSyncOperation('merge')
    # PubNub DataSync BETA: Remove Object. Returns a $q promise
    c.datasync_BETA.ngRemove = _makeDataSyncOperation('remove')

    # PubNub DataSync BETA: Internal use only. Creates a callback for sync events
    _syncCallback = (name, object_id, path) -> (r) ->
      $rootScope.$broadcast(c.datasync_BETA.ngObjPathRecEv(object_id, path), {
        action: name
        object_id : object_id
        path : path
        payload : r
      })
      $rootScope.$apply()

    # PubNub DataSync BETA: Sync object. Retrieves the specified object and metadata, with live updates and Angular $broadcast events enabled. NOTE: only one of 'ngSync' or 'ngWatch' may be used for a given object. Using both appears to corrupt the connection.
    c.datasync_BETA.ngSync = (object_id) ->
      return unless object_id
      result = c['jsapi']['sync'].apply c['_instance'], [object_id]
      ['ready','change','update','remove','set','error'].forEach (x) -> result.on[x](_syncCallback(x, object_id, null))
      ['connect','disconnect','reconnect'].forEach (x) -> result.on.network[x](_syncCallback(x, object_id, null))
      result

    # PubNub DataSync BETA: $rootScope broadcast event name for object/path combination
    c.datasync_BETA.ngObjPathEv      = (object_id, path) -> 'pn-datasync-obj:' + c.datasync_BETA.ngObjPathChan(object_id, path)
    # PubNub DataSync BETA: $rootScope broadcast event name for recursive object/path combination
    c.datasync_BETA.ngObjPathRecEv   = (object_id, path) -> 'pn-datasync-obj-rec:' + c.datasync_BETA.ngObjPathRecChan(object_id, path)
    # PubNub DataSync BETA: $rootScope broadcast event name for object datastore operations
    c.datasync_BETA.ngObjDsEv        = (object_id)       -> 'pn-datasync-obj-ds:' + c.datasync_BETA.ngObjDsChan(object_id)

    # PubNub DataSync BETA: Watch an object. Events are broadcast on $rootScope. NOTE: only one of 'ngSync' or 'ngWatch' may be used for a given object. Using both appears to corrupt the connection.
    c.datasync_BETA.ngWatch = (args) ->
      return unless args && args['object_id']
      object_id = args['object_id']
      path      = args['path']
      datastore = { chan : c.datasync_BETA.ngObjDsChan(object_id), ev : c.datasync_BETA.ngObjDsEv(object_id) }
      object_ds = { chan : c.datasync_BETA.ngObjPathChan(object_id, path), ev : c.datasync_BETA.ngObjPathEv(object_id, path) }
      object_ds_rec = { chan : c.datasync_BETA.ngObjPathRecChan(object_id, path), ev : c.datasync_BETA.ngObjPathRecEv(object_id, path) }
      oldcallback = args.callback
      [object_ds, object_ds_rec, datastore].forEach (cfg) ->
        ((chan, ev) ->
          args.channel = chan
          args.callback = (o) ->
            payload = {
              event: ev
              channel: chan
              object_id : object_id
              path : path
              payload : o
            }
            $rootScope.$broadcast(ev, payload)
            oldcallback(payload) if oldcallback
          c['jsapi']['subscribe'].apply c['_instance'], [args]
        )(cfg.chan, cfg.ev)

    # PubNub DataSync BETA: Internal use only. Channel Name for object/path combination
    c.datasync_BETA.ngObjPathChan    = (object_id, path) -> 'pn_ds_' + object_id + (if path then '.' + path else '')
    # PubNub DataSync BETA: Internal use only. Channel Name for recursive object/path combination
    c.datasync_BETA.ngObjPathRecChan = (object_id, path) -> c.datasync_BETA.ngObjPathChan(object_id, path) + '.*'
    # PubNub DataSync BETA: Internal use only. Channel Name for object data store operations
    c.datasync_BETA.ngObjDsChan      = (object_id)       -> 'pn_dstr_' + object_id

    # ... And we're done! We return this object as the PubNub AngularJS service instance.
    c
  ]
