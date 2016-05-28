/* @flow */

const pubnubConfig = require('../config.json');
/* global angular */
angular.module('pubnub.angular.service')
    .factory('$pubnubChannelGroup', ['$rootScope', '$q', 'Pubnub', '$pubnubChannel',
        function ($rootScope, $q, Pubnub, $pubnubChannel) {
        /**
         * Constructor
         * The constructor is called through this way $pubnubChannelGroup(channelGroup, options) and shoudld rarely called directely
         * This object is a container of channels
         * You can access to one of a channel by calling the #getChannel(channel) method
         * Optionnal parameters available to pass in the config hash:
         * {
         *    instance: 'deluxeInstance',  // The instance that will be used, default: {default PubNub instance}
         *    autosubscribe: true,         // Automatically subscribe to the channel group, default: true
         *    presence: false              // If autosubscribe enabled, subscribe and trigger the presence events for the channel group, default: false
         *    channelExtension: {foo: function(){ return "bar"}} // Define additionnal functions or override some for the channel instanciated
         *
         * }
         * @param {String} channelGroup | {Hash} config
         * @returns the channel group itself;
         * @constructor
         */
          function PubnubChannelGroup(channelGroup, _config) {
                // Instanciate the PubnubChannelGroup and return it
            if (!(this instanceof PubnubChannelGroup)) {
              return new PubnubChannelGroup(channelGroup, _config);
            }

            let self = this;
            let config = _config || {};

            if (!channelGroup) {
              throw new Error('The channel group name is required');
            }

            // autosubscribe
            if (config.autosubscribe && !(typeof config.autosubscribe === 'boolean')) {
              throw new Error('The autosubscribe parameter should be a boolean');
            }
            // presence
            if (config.presence && !(typeof config.presence === 'boolean')) {
              throw new Error('The presence parameter should be a boolean');
            }

            if (config.channelExtension && !(angular.isObject(config.channelExtension))) {
              throw new Error('The channelExtension should be an object');
            }

            this._channelGroup = channelGroup;
            // Maintain the list of channel objects
            this.$channels = {};
            // PubNub Instance that will be used by this PubNub channel
            this._pubnubInstance = config.instance ? Pubnub.getInstance(config.instance) : Pubnub.getInstance(pubnubConfig.default_instance_name);
            // Subscribe and trigger the presence events
            this._presence = config.presence == null ? false : config.presence;
            // Indicates if it should automatically subscribe to the PubNub channel, default: true
            this._autosubscribe = config.autosubscribe == null ? true : config.autosubscribe;
            // Extensions for the channel beeing instanciated
            this._extendedChannel = config.channelExtension ? $pubnubChannel.$extend(config.channelExtension) : null;
            // The handler that allow to stop listening to new messages
            this._unsubscribeHandler = null;

            let eventsToTrigger = ['callback', 'connect', 'reconnect', 'disconnect', 'error', 'idle'];
            // Trigger the presence event?
            if (this._presence) {
              eventsToTrigger.push('presence');
            }
            // Automatically subscribe to the channel
            if (this._autosubscribe) {
              this._pubnubInstance.subscribe({
                channel_group: this._channelGroup,
                triggerEvents: eventsToTrigger
              });
            }

            // Allow to unsubscribe to the channel group
            let eventName = Pubnub.getMessageEventNameFor(self._channelGroup, self._pubnubInstance.label);
            this._unsubscribeHandler = $rootScope.$on(eventName, self.$$newMessage.bind(self));

            return this;
          }

          PubnubChannelGroup.prototype = {
            /**
             * Return the channel object specified from the name
             * the message can be from any channel of the channel group
             * @protected
             */
            $channel(channel) {
              if (!angular.isDefined(this.$channels[channel])) {
                let options = {
                  instance: this._pubnubInstance.label,
                  autosubscribe: false,
                  presence: false,
                  autostore: true
                };
                let newChannel = this._extendedChannel ? new this._extendedChannel(channel, options) : $pubnubChannel(channel, options);
                this.$channels[channel] = newChannel;
              }

              return this.$channels[channel];
            },

            /**
             * Return the Pubnub instance associated to this PubNub Channel Group
             * @returns {Pubnub} the Pubnub instance
             */
            $pubnubInstance() {
              return this._pubnubInstance;
            },

            /**
             * Return the channel name on which this PubnubChannelGroup is based
             * @returns {String} the channel name
             */
            $channelGroup() {
              return this._channelGroup;
            },

            /**
             * Inform the object to not receive the events anymore
             * and and clears memory being used by this array
             */
            $destroy() {
              this._unsubscribeHandler();

              for (let channel in this.$channels) {
                if (this.$channels.hasOwnProperty(channel)) {
                  delete this.$channels[channel];
                }
              }
            },

            /**
             * Called when an new message has been received in the channel from the PubNub network
             * the message can be from any channel of the channel group
             * @protected
             */
            $$newMessage(ngEvent, message, env) {
              let channel = env[3];
              this.$channel(channel).$$newMessage(ngEvent, message, env);
            }
          };

          return PubnubChannelGroup;
        }
    ]);
