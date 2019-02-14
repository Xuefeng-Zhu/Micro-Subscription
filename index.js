const axios = require('axios');
const _ = require('lodash');

const api = require('./api');
const chain = require('./chain');
const config = require('./config');

const { firebase, user, provider, frequency } = config;

const TIMEOUT = frequency * 1000;
let health;
let loadingHealth;

function openChannel(client) {
  return client.openEthChannel('100', '100');
}

function getStat(client, role) {
  api.getStat(client).then((data) => {
    axios.put(`${firebase}/${role}.json`, data);
  });
}

function resolveChannel(client, onSuccess = _.noop) {
  console.log(`resolve payment at ${new Date()}`);

  return api.resolveChannel(client).then(onSuccess);
}

function sendUserPay() {
  console.log(`Send user payment at ${new Date()}`);
  return api
    .sendPay(user.client, provider.address, user.queryResult)
    .then(() => {
      setTimeout(() => {
        resolveChannel(user.client, sendUserPay);
      }, TIMEOUT);
    });
}

function sendProviderPay() {
  console.log(`Send provider payment at ${new Date()}`);

  return api
    .sendPay(provider.client, user.address, provider.queryResult)
    .then(() => {
      setTimeout(() => {
        resolveChannel(provider.client, sendProviderPay);
      }, TIMEOUT);
    });
}

function checkHealth() {
  if (loadingHealth) {
    return
  }

  if (_.isNil(health)) {
    loadingHealth = true
    chain.uptime()
    .then((res) => {
      loadingHealth = false
      health = res.toNumber();
      axios.put(`${firebase}/uptime.json`, `${health}`);
      axios.put(`${firebase}/health/running.json`, `${health}`);
    })
    return;
  }

  api.checkHealth().then(({ data }) => {
    if (data.running !== health) {
      health = data.running;
      chain
        .updateUptime()
        .then(res => {
          resolveChannel(user.client);
          resolveChannel(provider.client);
          axios.put(
            `${firebase}/uptime.json`,
            `${health}`
          );
        })
        .catch(console.log);
    }
  });
}

function main() {
  // openChannel(user.client)
  Promise.all([openChannel(user.client), openChannel(provider.client)])
  .then(() => {
    console.log('test')
    sendUserPay();
    sendProviderPay();

    setInterval(checkHealth, 1000);
    setInterval(() => {
      getStat(provider.client, 'provider');
      getStat(user.client, 'user');
    }, 2000);
  })
}

main();
