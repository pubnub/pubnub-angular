"use strict";

var expect = chai.expect;

describe("Builder for", function () {
    var Pubnub,
        $rootScope;

    beforeEach(module('pubnub.angular.service'));

    beforeEach(inject(function (_Pubnub_, _$rootScope_) {
        $rootScope = _$rootScope_;
        Pubnub = _Pubnub_;
    }));

    describe("event name", function () {
        it("should build correct string", function () {
            inject(function () {
                expect(Pubnub.getEventNameFor('history', 'callback')).to.be.equal('pubnub:default:history:callback');
                expect(Pubnub.getEventNameFor('history', 'callback', 'second')).to.be.equal('pubnub:second:history:callback');
            });
        });
    });

    describe("message event name", function () {
        it("should build correct string", function () {
            inject(function () {
                expect(Pubnub.getMessageEventNameFor('channelName')).to.be.equal('pubnub:default:subscribe:callback:channelName');
                expect(Pubnub.getMessageEventNameFor('channelName', 'second')).to.be.equal('pubnub:second:subscribe:callback:channelName');
            });
        });
    });

    describe("presence event name", function () {
        it("should build correct string", function () {
            inject(function () {
                expect(Pubnub.getPresenceEventNameFor('channelName')).to.be.equal('pubnub:default:subscribe:presence:channelName');
                expect(Pubnub.getPresenceEventNameFor('channelName', 'second')).to.be.equal('pubnub:second:subscribe:presence:channelName');
            });
        });
    });
});
