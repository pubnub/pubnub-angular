describe('$pubnubChannel', function () {

  var $pubnubChannel, Pubnub;
      
  beforeEach(function () {
    module('pubnub.angular.service');
  });
  
  beforeEach(function() {
    inject(function (_Pubnub_) {
      Pubnub = _Pubnub_;
    });
  });

  describe('<constructor>', function () {
    
    this.timeout(5000);
  
    beforeEach(function() {
      inject(function (_$pubnubChannelGroup_) {
        $pubnubChannelGroup = _$pubnubChannelGroup_;
        Pubnub.init(config.demo)
      });
    });
    
    describe('parameters definition', function () {
      
      context('The channel group name is the minimum parameter required', function(){
        it('throws an error', function() {
          expect(function(){ $pubnubChannelGroup() }).to.throw(null);
        });
      })
    
      context('No Pubnub instance is provided', function(){
        it('the instance set should be the default PubNub instance ', function() {
            var chan = $pubnubChannelGroup('channel');
            expect(chan.$pubnubInstance().label).to.be.equal('default');
        });
      })
      
        context('A Pubnub instance name is provided', function(){
          it('it should be set as the Pubnub instance', function() {
            Pubnub.getInstance('myAwesomePubnubInstance').init(config.demoWithHistoryRetention)
            var chan = $pubnubChannelGroup('channel', {instance: 'myAwesomePubnubInstance'});
            expect(chan.$pubnubInstance().label).to.be.equal('myAwesomePubnubInstance');

          });
        })
        
        
        context('The autosubscribe parameter should be a boolean', function(){
                    
          it('throws an error', function() {
            expect(function(){ $pubnubChannelGroup('channel', {autosubscribe: 'no'}) }).to.throw(null);
          });
        })
        
        context('The channelExtension parameter should be an object', function(){
                    
          it('throws an error', function() {
            expect(function(){ $pubnubChannelGroup('channel', {channelExtension: true}) }).to.throw(null);
          });
        })

        context('The presence parameter should be a boolean', function(){
                    
          it('throws an error', function() {
            expect(function(){ $pubnubChannelGroup('channel', {presence: 'no'}) }).to.throw(null);
          });
        })
    })
    
    describe('return value', function () {
      
      it('return an instance of pubnub channel group', function() {
        expect($pubnubChannelGroup('myChannel')).to.be.an('object');
      });
      
    }) 
  })   
  
  describe('default behaviors', function () {
    
    this.timeout(5000);
  
    beforeEach(function() {
      inject(function (_$pubnubChannelGroup_) {
        $pubnubChannelGroup = _$pubnubChannelGroup_;
        Pubnub.getInstance('instanceWithChannelGroup').init(config.with_channel_groups)
      });
    });
    
    it('automatically store the messages received in the channel group', function(done) {  
      
      var chan_gp = $pubnubChannelGroup('kittyChannelGroup',{ instance: 'instanceWithChannelGroup' })
      
      setTimeout(function(){ 
        
        if(config.version === 3){
          Pubnub.getInstance('instanceWithChannelGroup').publish({
            channel: 'kitty3',
            message: {foo: 'bar'},
            callback: function(){    
              setTimeout(function(){
                expect(chan_gp.$channel('kitty3').length).to.equal(1)
                done();
              },1000)
            }
          });
        } else {
          Pubnub.getInstance('instanceWithChannelGroup').publish({
            channel: 'kitty3',
            message: {foo: 'bar'},
          }, function(status,response){
            setTimeout(function(){
              expect(chan_gp.$channel('kitty3').length).to.equal(1)
              done();
            },1000)
          });
        }
        
        
      },1000)    
    });
  }) 
    
  describe('Public API', function(){
    this.timeout(5000);
    
    beforeEach(function() {
      inject(function (_$pubnubChannelGroup_, _$rootScope_) {
        $pubnubChannelGroup = _$pubnubChannelGroup_;
        Pubnub.init(config.demoWithHistoryRetention)
        $rootScope = _$rootScope_;
      });
    });
    
    describe('$channel', function () {  
      
      it('create a Pubnub channel object', function() {
        
        var chan_gp = $pubnubChannelGroup('randomChannelgroup')
        var chan = chan_gp.$channel('random')
        
        expect(chan).to.be.instanceof(Array);
        expect(chan.$publish).to.be.a('function');
        expect(chan.$channel()).to.be.equal('random');
        
        expect(chan_gp.$channel('random')).to.be.instanceof(Array);
        expect(chan_gp.$channel('random').$publish).to.be.a('function');
        expect(chan_gp.$channel('random').$channel()).to.be.equal('random');
        
      });  
      
      
      it('get the prior channel created and do not create an other one', function(done) {
        
        var chan_gp = $pubnubChannelGroup('randomChannelgroup')
        var chan = chan_gp.$channel(config.channelWithHistory)
        chan.$load(10)
      
        setTimeout(function(){   
          expect(chan_gp.$channel(config.channelWithHistory).length).to.equal(10)
          done();
        },2000)
        
      }); 

      context("The channels group is extended", function(){
      
        it('create a Pubnub channel object extended', function() {
          
          var channelExtension = {foo: function(){ return "bar"}}
          
          var options = {channelExtension: channelExtension}
          
          var chan_gp = $pubnubChannelGroup('randomChannelgroup', options)
          var chan = chan_gp.$channel('random')
          
          expect(chan).to.be.instanceof(Array);
          expect(chan.$publish).to.be.a('function');
          expect(chan.foo).to.be.a('function');
          expect(chan.$channel()).to.be.equal('random');
          
          expect(chan_gp.$channel('random')).to.be.instanceof(Array);
          expect(chan_gp.$channel('random').$publish).to.be.a('function');
          expect(chan_gp.$channel('random').foo).to.be.a('function');
          expect(chan_gp.$channel('random').$channel()).to.be.equal('random');
          
        });
        
        it('shouldnt extend other channels of channels groups', function() {
          
          var channelExtension = {foo: function(){ return "bar"}}        
          var options = {channelExtension: channelExtension}
          var extendedChanGp = $pubnubChannelGroup('randomChannelgroup', options)
          
          var chanGp2 = $pubnubChannelGroup('randomChannelgroup2')
          
          var chan = extendedChanGp.$channel('random')
          var chan2 = chanGp2.$channel('random2')
          
          expect(chan).to.be.instanceof(Array);
          expect(chan.$publish).to.be.a('function');
          expect(chan.foo).to.be.a('function');
          expect(chan.$channel()).to.be.equal('random');
          
          expect(chan2).to.be.instanceof(Array);
          expect(chan2.$publish).to.be.a('function');
          expect(chan2.foo).to.not.be.a('function');
          expect(chan2.$channel()).to.be.equal('random2');
          
        });
        
      });
    });
    
    describe('$pubnubInstance', function () {  
      it('is returning the pubnub instance used', function() {
        Pubnub.getInstance('myAwesomePubnubInstance').init(config.demoWithHistoryRetention)
        var chan_gp = $pubnubChannelGroup('randomChannelgroup', {instance: 'myAwesomePubnubInstance'});
        expect(chan_gp.$pubnubInstance().label).to.be.equal('myAwesomePubnubInstance');
        
      });
    });
    
    describe('$channelGroup', function () {  
      it('is returning the name of the channel used', function() {
        var chan_gp = $pubnubChannelGroup('rainbowChannel');
        expect(chan_gp.$channelGroup()).to.be.equal('rainbowChannel');
      });
    });
    
    describe('$destroy', function () {  
      
      it('should empty the array', function(done) {
        
        var chan_gp = $pubnubChannelGroup('randomChannelgroup')
        var chan = chan_gp.$channel(config.channelWithHistory)
        chan.$load(10)
      
        setTimeout(function(){   
          expect(chan_gp.$channel(config.channelWithHistory).length).to.equal(10)
          chan_gp.$destroy();
          expect(chan_gp.$channels).to.be.empty
          done();
        },2000)
        
      });
    });
  });
});
