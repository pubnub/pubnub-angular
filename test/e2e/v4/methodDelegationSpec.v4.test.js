describe("methodDelegation", function () {
    "use strict";

    var stringMessage = "hey",
        channel,
        Pubnub,
        $rootScope;

    beforeEach(angular.mock.module('pubnub.angular.service'));

    beforeEach(inject(function (_Pubnub_, _$rootScope_) {
        $rootScope = _$rootScope_;
        Pubnub = _Pubnub_;
        channel =  getRandomChannel();
        Pubnub.init(config.with_channel_groups);
    }));


    describe("Push", function () {

        it("should be delegated", function (done) {
          inject(function () {      
                  Pubnub.init(config.demo);
                  expect(Pubnub.push).to.be.an('object');
                  expect(Pubnub.push.addChannels).to.be.a('function');
                  expect(Pubnub.push.deleteDevice).to.be.a('function');
                  expect(Pubnub.push.listChannels).to.be.a('function');
                  expect(Pubnub.push.removeChannels).to.be.a('function');
                  done();
          })
        });
        it("should invoke callback of the push methods", function (done) {
            inject(function () {

              Pubnub.push.addChannels({
                    channels: ['a', 'b'],
                    device: 'niceDevice',
                    pushGateway: 'apns' // apns, gcm, mpns
                  }, function(status, response){
                      
                      expect(status.statusCode).to.be.equal(403);
                      done();
                    
                  });
            });
        });
        
        it("should trigger events of the push methods", function (done) {
            inject(function () {
              Pubnub.push.addChannels({
                    channels: ['a', 'b'],
                    device: 'niceDevice',
                    pushGateway: 'apns', // apns, gcm, mpns
                    triggerEvents: true
                });
                $rootScope.$on(Pubnub.getEventNameFor('push.addChannels', 'callback'), function (event, status, response) {
                  expect(status.statusCode).to.be.equal(403);
                  done();
                });
            });
        });
    });
    
    describe("channelGroups", function () {

        it("should be delegated", function (done) {
          inject(function () {      
                  Pubnub.init(config.demo);
                  expect(Pubnub.channelGroups).to.be.an('object');
                  expect(Pubnub.channelGroups.addChannels).to.be.a('function');
                  expect(Pubnub.channelGroups.deleteGroup).to.be.a('function');
                  expect(Pubnub.channelGroups.listGroups).to.be.a('function');
                  expect(Pubnub.channelGroups.removeChannels).to.be.a('function');
                  done();
          })
        });
        
        it("should invoke callback of the channelGroups methods", function (done) {
            inject(function () {
              
              Pubnub.channelGroups.addChannels(
                  {
                      channels: ['ch1', 'ch2'],
                      channelGroup: "myChannelGroup"
                  }, 
                  function(status, response) {
                    expect(status.statusCode).to.be.equal(200);
                    done();
                  }
              );
            });
        });
        
        it("should trigger events of the channelGroups methods", function (done) {
            inject(function () {
              Pubnub.channelGroups.addChannels(
                  {
                      channels: ['ch1', 'ch2'],
                      channelGroup: "myChannelGroup",
                      triggerEvents: true
                  });
                $rootScope.$on(Pubnub.getEventNameFor('channelGroups.addChannels', 'callback'), function (event, status, response) {
                  expect(status.statusCode).to.be.equal(200);
                  done();
                });
            });
        });
    });
    describe("setFilterExpression", function () {
        it("should be delegated", function () {
          inject(function () {      
                  Pubnub.init(config.demo);
                  expect(Pubnub.setFilterExpression).to.be.a('function');          
          })
        });
    });
});
