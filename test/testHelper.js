var config = {};

var expect = chai.expect;

config.demo = {
    publish_key: 'ds',
    subscribe_key: 'ds'
};

config.admin = {
  publish_key: 'ds',
  subscribe_key: 'ds',
  secret_key: 'demo'
};

config.user = {
  publish_key: 'ds',
  subscribe_key: 'ds',
  secret_key: 'demo'
};

config.fake = {
    publish_key: 'fake',
    subscribe_key: 'fake'
};

function getRandomChannel() {
    return "pubnub-angular-test-publish-" + getRandom();
}

function getRandom(max) {
    if (!max) max = 10000;
    return Math.floor(Math.random() * max)
}
