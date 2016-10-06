describe("#subscribe()", function () {
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
        Pubnub.init(config.demo);
    }));

    afterEach(function (done) {

        inject(function (_Pubnub_,_$rootScope_) {
            _Pubnub_.unsubscribe({
                channels: [channel]
            })
            _Pubnub_.addListener({
              status: function(s){
                expect(s.operation).to.be.equal('PNUnsubscribeOperation');
                done();
              }
            })            
        })
    });
    
    this.timeout(10000);

    describe("Subscribe events", function () {

        it("should be triggered", function (done) {
            inject(function () {

                Pubnub.init(config.demo);

                Pubnub.subscribe({
                    channels: [channel],
                    triggerEvents: true
                });

                $rootScope.$on(Pubnub.getEventNameFor('subscribe', 'status'), function (pnEvent, status) {
                  if (status.category == 'PNConnectedCategory'){
                      Pubnub.publish({
                          channel: channel,
                          message: stringMessage,
                          triggerEvents: true
                      })
                    }
                  });

                $rootScope.$on(Pubnub.getMessageEventNameFor(channel), function (pnEvent, m) {
                    expect(m.message).to.be.equal(stringMessage);
                    expect(m.channel).to.be.equal(channel);
                    done();
                });

              
            });
        });
    });

    describe("presence listener", function () {
        it("should be invoked", function (done) {
            this.timeout(10000);

            inject(function () {
                var uuid = "uuid" + getRandom(10000).toString();

                Pubnub.init(config.demo);
                
                Pubnub.subscribe({
                    channels: [channel],
                    withPresence: true,
                    triggerEvents: true
                });
          
                Pubnub.addListener({
                  status: function(s){
                    
                    if (s.category == 'PNConnectedCategory'){
                      Pubnub.getInstance("deluxeInstance4").init(config.demo); 
                      Pubnub.getInstance("deluxeInstance4").setUUID(uuid);
                      
                      Pubnub.getInstance("deluxeInstance4").subscribe({
                          channels: [channel]
                      });
                    }},
                    presence: function(event){
                      expect(event.action).to.be.equal('join');
                      if (event.uuid !== Pubnub.getUUID()) {
                        done();
                      }
                    }
                  });

            });
        });


        it("should be triggered", function (done) {
            this.timeout(10000);

            inject(function () {
                var uuid = "uuid-" + getRandom(10000).toString();
              
                Pubnub.init(config.demo);
                
                Pubnub.addListener({
                  status: function(s){
                    if (s.category == 'PNConnectedCategory'){
                      
                      Pubnub.getInstance("another3").init(config.demo);
                      Pubnub.getInstance("another3").setUUID(uuid);
                      Pubnub.getInstance("another3").subscribe({
                          channels: [channel]
                      });
                    }},
                    presence: function(event){
                      
                      if (event.uuid !== Pubnub.getUUID()) {
                          done();
                      }    
                    }
                  });
  
                $rootScope.$on(Pubnub.getPresenceEventNameFor(channel), function (pnEvent, event) {
                    expect(event.action).to.be.equal('join');

                    if (event.uuid !== Pubnub.getUUID()) {
                        done();
                    }
                });
                
                Pubnub.subscribe({
                    channels: [channel],
                    withPresence: true,
                    triggerEvents: ['presence','status']
                });

            });
        })
    });

    describe("Message callback", function () {
      
        describe("Subscribing to a regular message channel", function () {

          context('triggerEvents option is not specified', function() {
      
              it("The message callback should be invoked as usual", function (done) {
                
                
                  Pubnub.init(config.demo);
                
                  Pubnub.subscribe({
                      channels: [channel]
                    });
                    
                  Pubnub.addListener({
                    status: function(s){
                      if (s.category == 'PNConnectedCategory'){

                        Pubnub.publish({
                            channel: channel,
                            message: {content: 'abcdefg'}
                        });
                        
                      }},
                      message: function(envelope){
                        expect(envelope.message.content).to.be.equal('abcdefg');
                        done();
                      }
                    });
                      
              });

          })

          context('triggerEvents option is specified', function() {

            it("The message callback should be invoked", function (done) {

                Pubnub.subscribe({
                    channels: [channel]
                  });
                  
                Pubnub.addListener({
                  status: function(s){
                    if (s.category == 'PNConnectedCategory'){

                      Pubnub.publish({
                          channel: channel,
                          message: {content: 'abcdefg'}
                      });
                      
                    }},
                    message: function(envelope){
                      expect(envelope.message.content).to.be.equal('abcdefg');
                      done();
                    }
                  });
                    
            });

              it("The message event should be broadcasted on the rootScope", function (done) {

                Pubnub.subscribe({
                    channels: [channel],
                    triggerEvents: ['message']
                });
                  
                Pubnub.addListener({
                  status: function(s){
                    if (s.category == 'PNConnectedCategory'){
                      
                      Pubnub.publish({
                          channel: channel,
                          message: {content: 'abcdefg'}
                      });
                      
                    }}
                  });

                  $rootScope.$on(Pubnub.getMessageEventNameFor(channel), function (pnEvent, envelope) {
                      expect(envelope.message.content).to.be.equal('abcdefg');
                      done();
                  });
                  
   
              });
          })
          
        });
        
        
    
    });
});
