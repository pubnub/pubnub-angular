var config = {};

var expect = chai.expect;

config.demo = {
    publish_key: 'demo',
    subscribe_key: 'demo'
};

config.admin = {
    publish_key: 'demo',
    subscribe_key: 'demo',
    secret_key: 'demo'
};

config.user = {
    publish_key: 'demo',
    subscribe_key: 'demo',
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