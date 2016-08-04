module.exports = function runTest(PUBNUB_VERSION){ describe("#publish()", function () {
    "use strict";

    var stringMessage = "hey",
        channel = "pubnub-angular-test-publish",
        Pubnub,
        $rootScope;

    beforeEach(angular.mock.module('pubnub.angular.service'));

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
                
                if(PUBNUB_VERSION == 3){
                
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
                }else{
                  
                  Pubnub.publish({
                      channel: channel,
                      message: stringMessage,
                      triggerEvents: true
                  }, function(status, response){
                      
                      expect(status.statusCode).to.be.equal(200);
                      expect(response.timetoken).to.not.equal(null);
                      done();
                    
                  });
                  
                }
            });
        });

        it("should trigger event when triggerEvents is true", function (done) {
            inject(function () {
                Pubnub.publish({
                    channel: channel,
                    message: stringMessage,
                    triggerEvents: true
                });
                
                if(PUBNUB_VERSION == 3){
                  $rootScope.$on(Pubnub.getEventNameFor('publish', 'callback'), function (event, result) {
                      expect(result[0]).to.be.equal(1);
                      expect(result[1]).to.be.equal('Sent');
                      done();
                  });
                }else{
                  $rootScope.$on(Pubnub.getEventNameFor('publish', 'callback'), function (event, status, response) {
                      expect(status.statusCode).to.be.equal(200);
                      expect(status.operation).to.be.equal('PNPublishOperation');
                      done();
                  });
                }
            });
        });

        it("should trigger event when triggerEvents is an array containing 'callback' element", function (done) {
            inject(function () {
                Pubnub.publish({
                    channel: channel,
                    message: stringMessage,
                    triggerEvents: ['callback']
                });
                
                if(PUBNUB_VERSION == 3){
                  $rootScope.$on(Pubnub.getEventNameFor('publish', 'callback'), function (event, result) {
                    expect(result[0]).to.be.equal(1);
                    expect(result[1]).to.be.equal('Sent');
                    done();
                  });
                }
                else{
                  $rootScope.$on(Pubnub.getEventNameFor('publish', 'callback'), function (event, status, response) {
                    expect(status.statusCode).to.be.equal(200);
                    expect(status.operation).to.be.equal('PNPublishOperation');
                      done();
                  });
                }
            });
        });

        it("should not trigger event when triggerEvents is an array without 'callback' element", function (done) {
            inject(function () {
                var spy = sinon.spy();
                
                if(PUBNUB_VERSION == 3){
                  
                  Pubnub.publish({
                      channel: channel,
                      message: stringMessage,
                      triggerEvents: ['error'],
                      callback: function () {
                          expect(spy).to.have.not.been.called;
                          done();
                      }
                  });
                }
                else{
                  
                  Pubnub.publish({
                      channel: channel,
                      message: stringMessage,
                      triggerEvents: ['fake']
                  }, function(status, response){
                      
                    expect(spy).to.have.not.been.called;
                    done();
                    
                  });
                  
                }

                $rootScope.$on(Pubnub.getEventNameFor('publish', 'callback'), spy);
            });
        });
    });

    describe("error callback", function () {
        beforeEach(function () {
            Pubnub.init({
                          publish_key: 'ds',
                          subscribe_key: 'ds',
                          origin: 'fake'
                        })
        });

        it.skip("should be invoked", function (done) {
            inject(function () {
                Pubnub.publish({
                    channel: channel,
                    message: 'hello',
                    callback: function () {
                        done(new Error("Success callback should not be invoked"))
                    },
                    error: function (error) {
                        done();
                    }
                });
            });
        });

        it.skip("should trigger event", function (done) {
            inject(function () {
                $rootScope.$on(Pubnub.getEventNameFor('publish', 'error'), function (event, error) {
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
}