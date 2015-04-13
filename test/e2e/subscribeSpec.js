describe("#subscribe()", function () {
    var stringMessage = "hey",
        channel = "pubnub-angular-test-publish",
        Pubnub,
        $rootScope;

    beforeEach(module('pubnub.angular.service'));

    beforeEach(inject(function (_Pubnub_, _$rootScope_) {
        $rootScope = _$rootScope_;
        Pubnub = _Pubnub_;
    }));

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
                    triggerEvent: true
                });

                $rootScope.$on(Pubnub.getEventNameFor('subscribe', 'connect'), function () {
                    Pubnub.publish({
                        channel: channel,
                        message: stringMessage,
                        triggerEvent: true
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
});
