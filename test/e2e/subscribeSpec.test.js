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
            inject(function () {
                Pubnub.init(config.demo);

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
        });

        it("should be triggered", function (done) {
            inject(function () {

                Pubnub.init(config.demo);

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
    });

    describe("presence callback", function () {
        it("should be invoked", function (done) {
            this.timeout(10000);

            inject(function () {
                var uuid = "blah";

                Pubnub.init(config.demo);

                Pubnub.subscribe({
                    channel: channel,
                    connect: function () {
                        Pubnub.getInstance("another").init(config.demo);
                        Pubnub.getInstance("another").set_uuid(uuid);

                        Pubnub.getInstance("another").subscribe({
                            channel: channel,
                            callback: function () {
                            }
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

        it("should be triggered", function (done) {
            this.timeout(10000);

            inject(function () {
                var uuid = "blah";

                Pubnub.init(config.demo);
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
        });
    });
});
