var config = {};

var expect = chai.expect;

config.version = 3;

config.demo = {
  publish_key: 'demo-36',
  subscribe_key: 'demo-36'
};

config.admin = {
  publish_key: 'demo-36',
  subscribe_key: 'demo-36',
  secret_key: 'demo'
};

config.user = {
  publish_key: 'demo-36',
  subscribe_key: 'demo-36',
  secret_key: 'demo'
};

// This key includes a channel group kittyChannelGroup
// that includes these channels: kitty1,kitty2,kitty3,kitty4,kitty5,kitty6,kitty7,kitty8,kitty9, kitty10
config.with_channel_groups = {
  publish_key: 'pub-c-8a727694-74b6-47ea-84a1-3e0cbb0f1b9b',
  subscribe_key: 'sub-c-75ef9b4c-1628-11e6-875d-0619f8945a4f',
  secret_key: 'sec-c-ZmM0NWVmNzUtOGE4ZS00Y2MzLWExZDMtM2QxYmViYjdiYmM1',
  auth_key: 'master'
};

config.fake = {
    publish_key: 'fake',
    subscribe_key: 'fake'
};

config.demoWithHistoryRetention = {
    publish_key: 'demo-36',
    subscribe_key: 'demo-36'
};

config.channelWithHistory = 'channel-with-history-messages';

function getRandomChannel() {
    return "pubnub-angular-test-publish-" + getRandom();
}

function getRandom(max) {
    if (!max) max = 10000;
    return Math.floor(Math.random() * max)
}
