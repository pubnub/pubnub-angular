var config = {};

var expect = chai.expect;

config.version = 4;

config.demo = {
  publishKey: 'demo-36',
  subscribeKey: 'demo-36'
};

config.admin = {
  publishKey: 'demo-36',
  subscribeKey: 'demo-36',
  secretKey: 'demo'
};

config.user = {
  publishKey: 'demo-36',
  subscribeKey: 'demo-36',
  secretKey: 'demo'
};

// This key includes a channel group kittyChannelGroup
// that includes these channels: kitty1,kitty2,kitty3,kitty4,kitty5,kitty6,kitty7,kitty8,kitty9, kitty10
config.with_channel_groups = {
  publishKey: 'pub-c-8a727694-74b6-47ea-84a1-3e0cbb0f1b9b',
  subscribeKey: 'sub-c-75ef9b4c-1628-11e6-875d-0619f8945a4f',
  secretKey: 'sec-c-ZmM0NWVmNzUtOGE4ZS00Y2MzLWExZDMtM2QxYmViYjdiYmM1',
  authKey: 'master'
};

config.fake = {
    publishKey: 'fake',
    subscribeKey: 'fake'
};

config.demoWithHistoryRetention = {
    publishKey: 'demo-36',
    subscribeKey: 'demo-36'
};

config.channelWithHistory = 'channel-with-history-messages';

function getRandomChannel() {
    return "pubnub-angular-test-publish-" + getRandom();
}

function getRandom(max) {
    if (!max) max = 10000;
    return Math.floor(Math.random() * max)
}