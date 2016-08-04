describe('$pubnubChannel', function () {

  var $pubnubChannel, Pubnub;
      
  beforeEach(function () {
    module('pubnub.angular.service');
  });
  
  beforeEach(function() {
    inject(function (_Pubnub_, _$rootScope_) {
      Pubnub = _Pubnub_;
      $rootScope = _$rootScope_
    });
  });

  describe('<constructor>', function () {
    
    this.timeout(10000);
  
    beforeEach(function() {
      inject(function (_$pubnubChannel_) {
        $pubnubChannel = _$pubnubChannel_;
        Pubnub.init(config.demoWithHistoryRetention)
      });
    });
    
    describe('parameters definition', function () {
      
      context('The channel name is the minimum parameter required', function(){
        it('throws an error', function() {
          expect(function(){ $pubnubChannel() }).to.throw(null);
        });
      })
      
      context('The autoload parameter is a number between 0 and 100', function(){
                  
        it('throws an error', function() {
          expect(function(){ $pubnubChannel('channel', {autoload: 135}) }).to.throw(null);
        });
      })
      
      context('The autosubscribe parameter should be a boolean', function(){
                  
        it('throws an error', function() {
          expect(function(){ $pubnubChannel('channel', {autosubscribe: 'no'}) }).to.throw(null);
        });
      })

      context('The presence parameter should be a boolean', function(){
                  
        it('throws an error', function() {
          expect(function(){ $pubnubChannel('channel', {presence: 'no'}) }).to.throw(null);
        });
      })
      
      context('The presence parameter is provided', function(){
        it('triggers presence events', function(done) {
          
          var channelName = "channel-" + getRandom(10000).toString();
          var chan = $pubnubChannel(channelName, {presence: true})
          
          Pubnub.init(config.demo);
          
          var uuid = "uuid" + getRandom(10000).toString();
          
          Pubnub.getInstance('another2').init(config.demo);
          if(config.version === 3){
              Pubnub.getInstance("another2").set_uuid(uuid);
          } else {
             Pubnub.getInstance("another2").setUUID(uuid);
          }
          
          $rootScope.$on(Pubnub.getPresenceEventNameFor(channelName), function (pnEvent, event) {
            expect(event.action).to.be.equal('join');
            done();
          });
          
          Pubnub.getInstance('another2').subscribe({
            channel: channelName,
            callback: function(){}
          });
          
          
        });
      })
      
      context('The autostore parameter should be a boolean', function(){
                  
        it('throws an error', function() {
          expect(function(){ $pubnubChannel('channel', {autostore: 'no'}) }).to.throw(null);
        });
      })
      
      context('No Pubnub instance is provided', function(){
        it('the instance set should be the default PubNub instance ', function() {
            var chan = $pubnubChannel('channel');
            expect(chan.$pubnubInstance().label).to.be.equal('default');
        });
      })
      
      context('A Pubnub instance name is provided', function(){
        it('it should be set as the Pubnub instance', function() {
          Pubnub.getInstance('myAwesomePubnubInstance').init(config.demoWithHistoryRetention)
          var chan = $pubnubChannel('channel', {instance: 'myAwesomePubnubInstance'});
          expect(chan.$pubnubInstance().label).to.be.equal('myAwesomePubnubInstance');

        });
      })
      
    })
    
    describe('return value', function () {
      
      it('returns an array', function() {
        expect($pubnubChannel('myChannel')).to.be.instanceof(Array);
      });
      
    })
    
    describe('public methods', function () {
    
      it('should inject the public methods', function() {
        var chan = $pubnubChannel('myChannel')
        expect(chan.$load).to.be.function;
      });
      
    })
    
    
    describe('Creation and behaviors', function () {
      
      context('The autoload parameter is specified', function(){
        
        it('automatically populate the array', function(done) {
          
          var chan = $pubnubChannel(config.channelWithHistory, {autoload: 20})
          
          setTimeout(function(){   
            expect(chan.length).to.equal(20)
            done();
          },1500)
          
        });    
      });
      
      it('it automatically store the new messages', function(done) {
        
        Pubnub.getInstance('deluxeInstance1').init(config.demo)
        Pubnub.getInstance('deluxeInstance2').init(config.demo)
        
        var channelName = "channel-" + getRandom(10000).toString();
        var chan = $pubnubChannel(channelName, { instance: 'deluxeInstance1' })      
        
        setTimeout(function(){
          
          if(config.version === 3){
            Pubnub.getInstance('deluxeInstance2').publish({
                channel: channelName,
                message: 'Hello',
                callback: function(){
                  setTimeout(function(){
                       
                    expect(chan.length).to.equal(1)
                    done();
                  },3000)
                }
            });
          } else {
            
            Pubnub.getInstance('deluxeInstance1').addListener({
                message: function(event){
                  expect(chan.length).to.equal(1)
                  done()
                }
              });
                  
            Pubnub.getInstance('deluxeInstance2').publish({
                channel: channelName,
                message: 'Hello'
            });
          }
             
        },5000)
        

      });    
    });  
  });
  
  describe('Public API', function(){
    this.timeout(5000);
    
    beforeEach(function() {
      inject(function (_$pubnubChannel_, _$rootScope_) {
        $pubnubChannel = _$pubnubChannel_;
        Pubnub.init(config.demoWithHistoryRetention)
        $rootScope = _$rootScope_;
      });
    });
    
    describe('$load', function () {
      
      it('doesnt allow to fetch more than 100 messages', function() {
        
        var chan = $pubnubChannel(config.channelWithHistory)
        expect(function(){ chan.$load(150) }).to.throw(null);
        
      });
      
      it('populate the array with the messages', function(done) {
        
        var chan = $pubnubChannel(config.channelWithHistory)
                
        chan.$load(20).then(function(res){
            
              expect(chan.length).to.equal(20)
              
              if(config.version === 3){
                  expect(res[0].length).to.equal(20);
              } else {
                 expect(res.messages.length).to.equal(20);
              }
              
              done();
          
        })
      });  
      
      it('add messages if there is already messages', function(done) {
        
        var chan = $pubnubChannel(config.channelWithHistory)
                
        chan.$load(5).then(function(res){    
          chan.$load(5).then(function(res){
            
            expect(chan.length).to.equal(10)
            if(config.version === 3){
                expect(res[0].length).to.equal(5);
            } else {
               expect(res.messages.length).to.equal(5);
            }
            done();
            
          })
        })
        
      });  
      
    })
    
    describe('$publish', function () {  
      it('is publishing a message', function(done) {
        var chan = $pubnubChannel(config.channelWithHistory)
        
        chan.$publish('Hello').then(function(res){
            
          if(config.version === 3){
              expect(res[1]).to.be.equal('Sent')
          } else {
             expect(res.timetoken).not.to.equal(null);
          }
            done();        
        });
                   
        setTimeout($rootScope.$digest, 1200)           
        
      });    
    })
    
    describe('$pubnubInstance', function () {  
      it('is returning the pubnub instance used', function() {
        Pubnub.getInstance('myAwesomePubnubInstance').init(config.demoWithHistoryRetention)
        var chan = $pubnubChannel('channel', {instance: 'myAwesomePubnubInstance'});
        expect(chan.$pubnubInstance().label).to.be.equal('myAwesomePubnubInstance');
        
      });
    });
    
    describe('$channel', function () {  
      it('is returning the name og the channel used', function() {
        var chan = $pubnubChannel('rainbowChannel');
        expect(chan.$channel()).to.be.equal('rainbowChannel');
      });
    });
    
    
    describe('$allLoaded', function () {  
      it('indicates if all the messages have been loaded from the history', function(done) {
        var chan = $pubnubChannel('rainbowChannel');
        
        // False when initialized, even if there is no messages to load.
        // It is needed to call load once to know if there all the messages have been loaded.
        expect(chan.$allLoaded()).to.be.equal(false);
        
        chan.$load(20).then(function(res){
            
              expect(chan.$allLoaded()).to.be.equal(true);
              done();          
        })
      });
    });
    
    describe('$destroy', function () {  
      
      it('should empty the array', function(done) {
        
        var chan = $pubnubChannel(config.channelWithHistory, {autoload: 20})
        
        setTimeout(function(){   
          expect(chan.length).to.equal(20)
          chan.$destroy();
          expect(chan.length).to.equal(0)
          done();
        },1000)
        
      });
      
    });
    
    describe('$extend', function() {
      
      it('the methods parameter should be an object', function() {
        
        expect(function(){ $pubnubChannel.$extend(56) }).to.throw(null);      

      });
      
      it('return an array', function() {
        
        var ExtendedPubnubChannel = $pubnubChannel.$extend({})
        expect(new ExtendedPubnubChannel('myChannel')).to.be.instanceof(Array);

      });

      it('should be instanceof $pubnubChannel', function() {
        var ExtendedChannel = $pubnubChannel.$extend({});
        expect(ExtendedChannel).to.be.an('function');
      });

      it('should add the methods to the pubnubChannel', function() {
        
        var bar = function(){ return 'bar'; }
        var ExtendedChannel = $pubnubChannel.$extend({bar: bar});
        var chan = new ExtendedChannel('myChannel')
        
        expect(chan.$publish).to.be.instanceof(Function);
        expect(chan.bar).to.be.instanceof(Function);
        expect(chan.bar()).to.be.equal('bar');

      });
      
      it('should override existing methods of the pubnubChannel', function() {
        
        var overridedChannelMethod = function(){ 
          this.$messages.push('FakeData');
          return 'OverridedStoreMethod'; 
        }
        var ExtendedChannel = $pubnubChannel.$extend({$$store: overridedChannelMethod});
        var chan = new ExtendedChannel('myChannel')
          
        expect(chan.$$store()).to.be.equal('OverridedStoreMethod');
        expect(chan.length).to.be.equal(1);
        expect(chan[0]).to.be.equal('FakeData');

      });

      it('should work with the new keyword', function() {
        var bar = function(){ return 'bar'; }
        var ExtendedChannel = $pubnubChannel.$extend({bar: bar});
        var chan = new ExtendedChannel('myChannel')
        expect(chan.bar).to.be.an('function');
      });

      it('should work without the new keyword', function() {
        var bar = function(){ return 'bar'; }
        var ExtendedChannel = $pubnubChannel.$extend({bar: bar});
        var chan = ExtendedChannel('myChannel')
        expect(chan.bar).to.be.an('function');
      });
      
      it('shouldnt extend prototype of others pubnubChannels', function() {
        
        var bar = function(){ return 'bar'; }
        var ExtendedChannel = $pubnubChannel.$extend({bar: bar});
        
        var extendedChannel = new ExtendedChannel('myChannel')
        var nonExtendedChannel = $pubnubChannel('chan');
        
        expect(extendedChannel.bar).to.be.a('function');
        expect(extendedChannel.bar()).to.be.equal('bar');
          
        expect(nonExtendedChannel.bar).to.not.be.a('function');
        
      });
      
    });
  });  
  
});
