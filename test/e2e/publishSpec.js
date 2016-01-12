describe("#publish()", function () {
    "use strict";

    var stringMessage = "hey",
        channel = "pubnub-angular-test-publish",
        Pubnub,
        $rootScope;

    beforeEach(module('pubnub.angular.service'));

    beforeEach(function (done) {
        inject(function (_Pubnub_, _$rootScope_) {
            $rootScope = _$rootScope_;
            Pubnub = _Pubnub_;
            setTimeout(function () {
                done();
            }, 1000)
        })
    });

    describe("success callback", function () {
        this.timeout(2000);

        beforeEach(function () {
            Pubnub.init(config.demo)
        });

        it("should be invoked", function (done) {
            inject(function () {
                Pubnub.publish({
                    channel: channel,
                    message: stringMessage,
                    triggerEvents: true,
                    callback: function (payload) {
                        expect(payload[0]).to.be.equal(1);
                        expect(payload[1]).to.be.equal('Sent');
                        done();
                    }
                });
            });
        });

        it("should trigger event when triggerEvents is true", function (done) {
            inject(function () {
                Pubnub.publish({
                    channel: channel,
                    message: stringMessage,
                    triggerEvents: true
                });

                $rootScope.$on(Pubnub.getEventNameFor('publish', 'callback'), function (event, result) {
                    expect(result[0]).to.be.equal(1);
                    expect(result[1]).to.be.equal('Sent');
                    done();
                });
            });
        });

        it("should trigger event when triggerEvents is an array containing 'callback' element", function (done) {
            inject(function () {
                Pubnub.publish({
                    channel: channel,
                    message: stringMessage,
                    triggerEvents: ['callback']
                });

                $rootScope.$on(Pubnub.getEventNameFor('publish', 'callback'), function (event, result) {
                    expect(result[0]).to.be.equal(1);
                    expect(result[1]).to.be.equal('Sent');
                    done();
                });
            });
        });

        it("should not trigger event when triggerEvents is an array without 'callback' element", function (done) {
            inject(function () {
                var spy = sinon.spy();

                Pubnub.publish({
                    channel: channel,
                    message: stringMessage,
                    triggerEvents: ['error'],
                    callback: function () {
                        expect(spy).to.have.not.been.called;
                        done();
                    }
                });

                $rootScope.$on(Pubnub.getEventNameFor('publish', 'callback'), spy);
            });
        });
    });

    describe("error callback", function () {
        beforeEach(function () {
            Pubnub.init(config.fake)
        });

        it("should be invoked", function (done) {
            inject(function () {
                Pubnub.publish({
                    channel: channel,
                    message: stringMessage,
                    callback: function () {
                        done(new Error("Success callback should not be invoked"))
                    },
                    error: function (error) {
                        expect(error.message).to.equal("Invalid Subscribe Key");
                        done();
                    }
                });
            });
        });

        it("should trigger event", function (done) {
            inject(function () {
                $rootScope.$on(Pubnub.getEventNameFor('publish', 'error'), function (event, error) {
                    expect(error.message).to.equal("Invalid Subscribe Key");
                    done();
                });

                Pubnub.publish({
                    channel: channel,
                    message: stringMessage,
                    triggerEvents: true
                });
            });
        });
    });
});
