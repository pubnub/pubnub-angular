/* global angular */
module.exports = class {

  constructor(label, service, $rootScope, wrapper) {
    this.wrapper = wrapper;
    this.label = label;
    this.$rootScope = $rootScope;
    this.service = service;
    this.broadcastStatus = false;
    this.broadcastedChannels = {};
    this.broadcastedPresenceChannels = {};
    this.subscribeListener = null;
  }

  initializeSubscribeListener() {
    let $rootScope = this.$rootScope;
    let service = this.service;
    let self = this;
    this.subscribeListener = this.service.getInstance(this.label).addListener({
      message(m) {
        if ((m.subscription && self.broadcastedChannels[m.subscription]) ||
             (m.channel && self.broadcastedChannels[m.channel])) {
          $rootScope.$broadcast.bind.apply(
                   $rootScope.$broadcast,
                   [$rootScope, service.getMessageEventNameFor(m.subscribedChannel, self.label)]
                     .concat(Array.prototype.slice.call(arguments))
                 )();
        }
      },
      presence(m) {
        let presenceChannel = null;
        // If from channel group
        if (m.subscription !== null && self.broadcastedPresenceChannels[m.subscription]) {
          presenceChannel = m.subscription;
        } else if (m.channel !== null && self.broadcastedPresenceChannels[m.channel]) {
          presenceChannel = m.channel;
        }

        if (presenceChannel !== null) {
          $rootScope.$broadcast.bind.apply(
                   $rootScope.$broadcast,
                   [$rootScope, service.getPresenceEventNameFor(presenceChannel, self.label)]
                     .concat(Array.prototype.slice.call(arguments))
                 )();
        }
      },
      status() {
        if (self.broadcastStatus) {
          let eventName = self.service.getEventNameFor('subscribe', 'status', self.label);
          self.$rootScope.$broadcast.bind.apply(
               self.$rootScope.$broadcast,
               [self.$rootScope, eventName]
                 .concat(Array.prototype.slice.call(arguments))
             )();
        }
      }
    });
  }

  enableEventsBroadcast(eventsToBroadcast, args) {
    eventsToBroadcast.forEach((eventToBroadcast) => {
      if (eventToBroadcast === 'status') {
        this.broadcastStatus = true;
      }
      if (eventToBroadcast === 'message') {
        // Adds any message channel which are not presence channels
        if (args.channels && args.channels.length > 0) {
          args.channels.forEach((channel) => {
            if (channel.slice(-7) !== '-pnpres') {
              this.broadcastedChannels[channel] = true;
            }
          });
        }
        // Adds any message channel group which are not presence channels
        if (args.channelGroups && args.channelGroups.length > 0) {
          args.channelGroups.forEach((channelGroup) => {
            if (channelGroup.slice(-7) !== '-pnpres') {
              this.broadcastedChannels[channelGroup] = true;
            }
          });
        }
      }
      if (eventToBroadcast === 'presence') {
        // Adds the presence channels of the current channels
        if (args.withPresence) {
          if (args.channels && args.channels.length > 0) {
            args.channels.forEach((channel) => (this.broadcastedPresenceChannels[channel] = true));
          }
          if (args.channelGroups && args.channelGroups) {
            args.channelGroups.forEach((channelGroup) => (this.broadcastedPresenceChannels[channelGroup] = true));
          }
        // Add the presence channels that have been subscribed directely
        } else {
          if (args.channels && args.channels.length > 0) {
            args.channels.forEach((channel) => {
              if (channel.slice(-7) === '-pnpres') {
                this.broadcastedPresenceChannels[channel.slice(0, -7)] = true;
              }
            });
          }
          if (args.channelGroups && args.channelGroups) {
            args.channelGroups.forEach((channelGroup) => {
              if (channelGroup.slice(-7) === '-pnpres') {
                this.broadcastedPresenceChannels[channelGroup.slice(0, -7)] = true;
              }
            });
          }
        }
      }
    });
    if (this.subscribeListener === null) {
      this.initializeSubscribeListener();
    }
  }
};
