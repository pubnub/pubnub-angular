const pubnubConfig = require('../config.json');
/* global angular */
angular.module('pubnub.angular.service')
    .factory('$pubnubChannel', ['$rootScope', 'Pubnub', '$q',
    function ($rootScope, Pubnub, $q) {
      /**
      * Constructor
      * The constructor is called through this way $pubnubChannel(channelName, options) and shoudld rarely called directely
      * Optionnal parameters available to pass in the options hash:
      * {
      *    instance: 'deluxeInstance',  // The instance that will be used, default: {default PubNub instance}
      *    autoload: 50,                // The number of messages we want to autoload from history, default: none
      *    autosubscribe: true,         // Automatically subscribe to the channel, default: true
      *    presence: false              // If autosubscribe enabled, subscribe and trigger the presence events, default: false
      *    autostore: true              // Automatically store the messages received, default: true
      *
      * }
      * @param {String} channel
      * @param {Hash} config
      * @returns {Array}
      * @constructor
      */
      function PubnubChannel(channel, config) {
        // Instanciate the PubnubChannel and return it
        if (!(this instanceof PubnubChannel)) {
          return new PubnubChannel(channel, config);
        }

        config = config || {};

        if (!channel) {
          throw new Error('The channel name is required');
        }
        // autosubscribe
        if (config.autosubscribe && !(typeof config.autosubscribe === 'boolean')) {
          throw new Error('The autosubscribe parameter should be a boolean');
        }
        // presence
        if (config.presence && !(typeof config.presence === 'boolean')) {
          throw new Error('The presence parameter should be a boolean');
        }
        // autostore
        if (config.autostore && !(typeof config.autostore === 'boolean')) {
          throw new Error('The autostore parameter should be a boolean');
        }

        let self = this;
        // The channel we get data from
        this._channel = channel;
        // List that will store the messages received from the channel
        this.$messages = [];
        // Timetoken of the first message of the list
        // usefull for knowing from where to fetch the list history from
        this._timeTokenFirstMessage = null;
        // Indicates if all the messages have been fetched from PubNub history
        this._messagesAllFetched = false;
        // PubNub Instance that will be used by this PubNub channel
        this._pubnubInstance = config.instance ? Pubnub.getInstance(config.instance) : Pubnub.getInstance(pubnubConfig.default_instance_name);
        // Number of messages (between 0 and 100) to autoload in this array calling PubNub history
        this._autoload = config.autoload == null ? 0 : config.autoload;
        // Subscribe and trigger the presence events
        this._presence = config.presence == null ? false : config.presence;
        // Indicates if it should automatically subscribe to the PubNub channel, default: true
        this._autosubscribe = config.autosubscribe == null ? true : config.autosubscribe;
        // Indicates if it should store automatically the messages received from PubNub
        this._autostore = config.autostore == null ? true : config.autostore;

        // Bind the public methods to make them available on the array.
        this.$$getPublicMethods((fn, key) => {
          self.$messages[key] = fn.bind(self);
        });

        // The handler that allow to stop listening to new messages
        this._unsubscribeHandler = null;

        // Autoload the messages
        if (this._autoload !== 0) {
          this.$load(this._autoload);
        }

        let eventsToTrigger = ['callback', 'connect', 'reconnect', 'disconnect', 'error', 'idle'];
        // Trigger the presence event?
        if (this._presence) {
          eventsToTrigger.push('presence');
        }
        // Automatically subscribe to the channel
        if (this._autosubscribe) {
          this._pubnubInstance.subscribe({
            channel: this._channel,
            triggerEvents: eventsToTrigger
          });
        }

        // Automatically store the messages
        if (this._autostore) {
          let eventName = Pubnub.getMessageEventNameFor(self._channel, this._pubnubInstance.label);
          this._unsubscribeHandler = $rootScope.$on(eventName, self.$$newMessage.bind(self));
        }

        return this.$messages;
      }

      PubnubChannel.prototype = {

        /**
        *   Fetch and load the previous messages in the $messages array
        *   @param {Integer} numberOfMessages : number of messages we want to load.
        *   @returns {Promise} messages loaded or error
        */
        $load(numberOfMessages) {
          if (!(numberOfMessages > 0 && numberOfMessages <= 100)) {
            throw new Error('The number of messages to load should be a number between 0 and 100');
          }

          let self = this;
          let deferred = $q.defer();

          let args = {
            channel: self._channel,
            count: numberOfMessages,
            reverse: false,
            callback(m) {
              // Update the timetoken of the first message
              self._timeTokenFirstMessage = m[1];

              self.$$storeBatch(m[0]);

              // Updates the indicator that all messages have been fetched.
              if (m[0].length < numberOfMessages) {
                self._messagesAllFetched = true;
              }

              deferred.resolve(m);
              $rootScope.$digest();
            },
            error(err) {
              deferred.reject(err);
            }
          };

          // If there is already messages in the array and consequently a first message timetoken
          if (self._timeTokenFirstMessage) {
            args.start = self._timeTokenFirstMessage;
          }

          self._pubnubInstance.history(args);
          return deferred.promise;
        },

        /**
        * Publish a message in the channel
        * @param {Hash} message : message we want to send
        * @returns {Promise} messages loaded or error
        */
        $publish(_message) {
          let self = this;
          let deferred = $q.defer();
          self._pubnubInstance.publish({
            channel: self._channel,
            message: _message,
            callback(m) { deferred.resolve(m); },
            error(err) { deferred.reject(err); }

          });

          return deferred.promise;
        },

        /**
        * Return the Pubnub instance associated to this PubNub Channel
        * @returns {Pubnub} the Pubnub instance
        */
        $pubnubInstance() {
          return this._pubnubInstance;
        },

        /**
        * Return the channel name on which this PubnubChannel
        * @returns {String} the channel name
        */
        $channel() {
          return this._channel;
        },

        /**
        * Indicates if all the messages have been fetched
        * @returns {Boolean} all the messages have been loaded
        */
        $allLoaded() {
          return this._messagesAllFetched;
        },

        /**
        * Inform the object to not receive the events anymore
        * and and clears memory being used by this array
        */
        $destroy() {
          if (this._unsubscribeHandler) {
            this._unsubscribeHandler();
          }
          this.$messages.length = 0;
        },

        /**
        * Called when an new message has been received in the channel from the PubNub network
        * @protected
        */
        $$newMessage(ngEvent, m) {
          this.$$store(m);
          $rootScope.$digest();
        },

        /**
        * Function called to store a message in the messages array.
        * @protected
        */
        $$store(message) {
          this.$messages.push(message);
        },

        /**
        * Function called in order to store a batch of message in the messages array.
        * @protected
        */
        $$storeBatch(messages) {
          // We add the messages in the array
          if (this.$messages.length === 0) {
            angular.extend(this.$messages, messages);
          } else {
            Array.prototype.unshift.apply(this.$messages, messages);
          }
        },

        /**
        * These methods allow the PubNub channel to extend his array with his Public methods
        */

        // Get the list of the public methods of the PubnubChannel (prefixed by $)
        // Return the list of the public methods of the prototype
        $$getPublicMethods(iterator, context) {
          this.$$getPrototypeMethods((m, k) => {
            if (typeof(m) === 'function' && k.charAt(0) !== '_') {
              iterator.call(context, m, k);
            }
          });
        },

        // Get the list of the methods of the PubnubChannel
        // Return the list of the methods of the prototype
        $$getPrototypeMethods(iterator, context) {
          let methods = {};
          let objProto = Object.getPrototypeOf({});
          let proto = angular.isFunction(this) && angular.isObject(this.prototype) ?
              this.prototype : Object.getPrototypeOf(this);
          while (proto && proto !== objProto) {
            for (let key in proto) {
              if (proto.hasOwnProperty(key) && !methods.hasOwnProperty(key)) {
                methods[key] = true;
                iterator.call(context, proto[key], key, proto);
              }
            }
            proto = Object.getPrototypeOf(proto);
          }
        }
      };

      /**
      * This method allows a PubnubChannel to be inherited
      * The methods passed into this function will be added onto the array's prototype.
      /* They can override existing methods as well.

      * @param {Object} methods a list of functions to add onto the prototype
      * @returns {Function} the extended pubnubChannel object
      * @static
      */
      PubnubChannel.$extend = function (methods) {
        if (!angular.isObject(methods)) {
          throw new Error('The methods parameter should be an object');
        }

        let ExtendedPubnubChannel = function (channel, config) {
          if (!(this instanceof PubnubChannel)) {
            return new ExtendedPubnubChannel(channel, config);
          }
          PubnubChannel.apply(this, arguments);
          return this.$messages;
        };
        ExtendedPubnubChannel.prototype = Object.create(PubnubChannel.prototype);
        angular.extend(ExtendedPubnubChannel.prototype, methods);

        return ExtendedPubnubChannel;
      };

      return PubnubChannel;
    }
]);
