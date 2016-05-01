describe("#subscribe()", function () {
    "use strict";

    var stringMessage = "hey",
        channel,
        Pubnub,
        $rootScope;

    beforeEach(module('pubnub.angular.service'));

    beforeEach(inject(function (_Pubnub_, _$rootScope_) {
        $rootScope = _$rootScope_;
        Pubnub = _Pubnub_;
        channel =  getRandomChannel();
        Pubnub.init(config.demo);
    }));

    afterEach(function (done) {
        
        this.timeout(10000);

        inject(function (_Pubnub_) {
            _Pubnub_.unsubscribe({
                channel: channel,
                callback: function () {
                    done();
                }
            })
        })
    });

    describe("success and connect callback", function () {


        it("should be invoked", function (done) {

                Pubnub.subscribe({
                    channel: channel,
                    connect: function () {
                        Pubnub.publish({
                            channel: channel,
                            message: stringMessage,
                            callback: function () {
                            }
                        });
                    },
                    callback: function (message, env, ch) {
                        expect(message).to.be.equal(stringMessage);
                        expect(ch).to.be.equal(channel);
                        done();
                    }
                });
        });

        it("should be triggered", function (done) {

            Pubnub.subscribe({
                channel: channel,
                triggerEvents: true
            });

            $rootScope.$on(Pubnub.getEventNameFor('subscribe', 'connect'), function () {
                Pubnub.publish({
                    channel: channel,
                    message: stringMessage,
                    triggerEvents: true
                });
            });

            $rootScope.$on(Pubnub.getMessageEventNameFor(channel), function (event, message, env, ch) {
                expect(message).to.be.equal(stringMessage);
                expect(channel).to.be.equal(ch);
                done();
            });
        });

    });

    describe("Presence callback", function () {

        context('triggerEvents option is not specified', function() {


            var uuid = "blah";  


            it("The presence callback should be invoked as usual", function (done) {
                

                inject(function () {

                    Pubnub.subscribe({
                        channel: channel,
                        connect: function () {

                            Pubnub.getInstance("another").init(config.demo);
                            Pubnub.getInstance("another").set_uuid(uuid);

                            Pubnub.getInstance("another").subscribe({
                                channel: channel,
                                callback: function () {}
                            });

                        },
                        callback: function () {
                        },
                        presence: function (event, envelope, ch) {
                            expect(event.action).to.be.equal('join');
                            expect(ch).to.be.equal(channel);

                            if (event.uuid !== Pubnub.get_uuid()) {
                                expect(event.uuid).to.be.equal(uuid);
                                done();
                            }
                        }
                    });
                });
                
            });
        });

        context('triggerEvents option is specified', function() {

            var uuid = "blah";  

            it("The original presence callback should be invoked", function (done) {

                    Pubnub.subscribe({
                        channel: channel,
                        connect: function () {

                            Pubnub.getInstance("another").init(config.demo);
                            Pubnub.getInstance("another").set_uuid(uuid);

                            Pubnub.getInstance("another").subscribe({
                                channel: channel,
                                callback: function () {}
                            });

                        },
                        callback: function () {
                        },
                        presence: function (event, envelope, ch) {
                            expect(event.action).to.be.equal('join');
                            expect(ch).to.be.equal(channel);

                            if (event.uuid !== Pubnub.get_uuid()) {
                                expect(event.uuid).to.be.equal(uuid);
                                done();
                            }
                        },
                        triggerEvents: ['presence']
                    });
                
            });


            it("The presence event should be broadcasted on the rootScope", function (done) {


                Pubnub.getInstance("another").init(config.demo);
                Pubnub.getInstance("another").set_uuid(uuid);

                Pubnub.subscribe({
                    channel: channel,
                    triggerEvents: ['callback', 'connect', 'presence']
                });

                $rootScope.$on(Pubnub.getEventNameFor('subscribe', 'connect'), function () {
                    Pubnub.getInstance("another").subscribe({
                        channel: channel,
                        triggerEvents: ['callback']
                    });
                });

                $rootScope.$on(Pubnub.getPresenceEventNameFor(channel), function (pnEvent, event) {
                    expect(event.action).to.be.equal('join');

                    if (event.uuid !== Pubnub.get_uuid()) {
                        expect(event.uuid).to.be.equal(uuid);
                        done();
                    }
                });


            });
        })
    });


    describe("Message callback", function () {

        context('triggerEvents option is not specified', function() {

            beforeEach('Subscribe to the channel and publish a message',function() {
                    
                Pubnub.publish({
                    channel: channel,
                    message: {content: 'abcdefg'} 
                });

            })
    
            it("The message callback should be invoked as usual", function (done) {

                Pubnub.subscribe({
                    channel: channel,
                    callback: function (event, envelope, ch) {
                        
                        expect(event.content).to.be.equal('abcdefg');
                        done();
                    }
                });

            });

        })

        context('triggerEvents option is specified', function() {


            it("The original message callback should be invoked", function (done) {

                Pubnub.subscribe({
                    channel: channel,
                    callback: function(m){
                     expect(m.content).to.be.equal('abcdefg'); 
                     done();
                    },
                    triggerEvents: ['callback'],
                });

                Pubnub.publish({
                    channel: channel,
                    message: {content: 'abcdefg'} 
                });

            });


            it("The message event should be broadcasted on the rootScope", function (done) {

                Pubnub.subscribe({
                    channel: channel,
                    triggerEvents: ['callback']
                });

                Pubnub.publish({
                    channel: channel,
                    message: {content: 'abcdefg'} 
                });

                $rootScope.$on(Pubnub.getMessageEventNameFor(channel), function (pnEvent, event) {
                    expect(event.content).to.be.equal('abcdefg');
                    done();
                });
 
            });
        })
    });

});
