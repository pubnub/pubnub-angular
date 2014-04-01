'use strict'

angular.module('pubnub.angular.service', [])
  .factory 'PubNub', ['$rootScope', ($rootScope) ->
    # initialize an instance object
    c = {
      'VERSION'   : '1.1.0'
      '_instance' : null
      '_channels' : []
      '_presence' : {}
      'jsapi'       : {}
    }

    # helper methods
    for k in ['map', 'each']
      if PUBNUB?[k] instanceof Function
        ((kk) -> c[kk] = ->
          c['_instance']?[kk].apply c['_instance'], arguments)(k)

    # core (original) PubNub API methods
    for k of PUBNUB
      if PUBNUB?[k] instanceof Function
        ((kk) -> c['jsapi'][kk] = ->
          c['_instance']?[kk].apply c['_instance'], arguments)(k)

    c.initialized = -> !!c['_instance']

    c.init = ->
      c['_instance'] = PUBNUB.init.apply PUBNUB, arguments
      c['_channels'] = []
      c['_presence'] = {}
      c['_presData'] = {}
      c['_instance']

    c.destroy = ->
      c['_instance'] = null
      c['_channels'] = null
      c['_presence'] = null
      c['_presData'] = null
      # TODO - destroy PUBNUB instance & reset memory

    c._ngFireMessages = (realChannel) ->
      (messages, t1, t2) ->
        c.each messages[0], (message) ->
          $rootScope.$broadcast "pn-message:#{realChannel}", {
            message: message
            channel: realChannel
          }

    c._ngInstallHandlers = (args) ->
      oldmessage = args.message
      args.message = ->
        $rootScope.$broadcast c.ngMsgEv(args.channel), {
          message: arguments[0],
          env: arguments[1],
          channel: args.channel
        }
        oldmessage(arguments) if oldmessage

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

    c.ngListChannels  = ->
      c['_channels'].slice 0

    c.ngListPresence = (channel) ->
      c['_presence'][channel]?.slice 0

    c.ngPresenceData = (channel) -> c['_presData'][channel] || {}

    c.ngSubscribe = (args) ->
      c['_channels'].push args.channel if c['_channels'].indexOf(args.channel) < 0
      c['_presence'][args.channel] ||= []
      args = c._ngInstallHandlers args
      c.jsapi.subscribe(args)

    c.ngUnsubscribe = (args) ->
      cpos = c['_channels'].indexOf(args.channel)
      c['_channels'].splice cpos, 1 if cpos != -1
      c['_presence'][args.channel] = null
      delete $rootScope.$$listeners[c.ngMsgEv(args.channel)]
      delete $rootScope.$$listeners[c.ngPrsEv(args.channel)]
      c.jsapi.unsubscribe(args)

    c.ngPublish = -> c['_instance']['publish'].apply c['_instance'], arguments

    c.ngHistory = (args) ->
      args.callback = c._ngFireMessages args.channel
      c.jsapi.history args

    c.ngHereNow = (args) ->
      args = c._ngInstallHandlers(args)
      args.state = true
      args.callback = args.presence
      delete args.presence
      delete args.message
      c.jsapi.here_now(args)

    c.ngWhereNow = (args) -> c.jsapi.where_now(args)
    c.ngState    = (args) -> c.jsapi.state(args)

    c.ngMsgEv = (channel) -> "pn-message:#{channel}"
    c.ngPrsEv = (channel) -> "pn-presence:#{channel}"

    c.ngAuth   = -> c['_instance']['auth'].apply c['_instance'], arguments
    c.ngAudit  = -> c['_instance']['audit'].apply c['_instance'], arguments
    c.ngGrant  = -> c['_instance']['grant'].apply c['_instance'], arguments

    c
  ]
