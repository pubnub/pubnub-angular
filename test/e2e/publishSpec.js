"use strict";

var expect = chai.expect;

describe("#publish()", function () {
    var stringMessage = "hey",
        channel = "pubnub-angular-test-publish",
        Pubnub,
        $rootScope;

    beforeEach(module('pubnub.angular.service'));

    beforeEach(inject(function (_Pubnub_, _$rootScope_) {
        $rootScope = _$rootScope_;
        Pubnub = _Pubnub_;
    }));

    describe("success callback", function () {
        beforeEach(function () {
            Pubnub.init(config.demo)
        });

        it("should be invoked", function (done) {
            inject(function () {
                Pubnub.publish({
                    channel: channel,
                    message: stringMessage,
                    triggerEvent: true,
                    callback: function (payload) {
                        expect(payload[0]).to.be.equal(1);
                        expect(payload[1]).to.be.equal('Sent');
                        done();
                    }
                });
            });
        });

        it("should trigger event", function (done) {
            inject(function () {
                Pubnub.publish({
                    channel: channel,
                    message: stringMessage,
                    triggerEvent: true
                });

                $rootScope.$on(Pubnub.getEventNameFor('publish', 'callback'), function (event, result) {
                    expect(result[0]).to.be.equal(1);
                    expect(result[1]).to.be.equal('Sent');
                    done();
                });
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
                    triggerEvent: true
                });
            });
        });
    });
});
