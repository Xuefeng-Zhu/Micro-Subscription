const axios = require('axios');
const _ = require('lodash');

const api = require('./api');
const chain = require('./chain');
const config = require('./config');

const { firebase, user, provider, frequency } = config;

const TIMEOUT = frequency * 1000;
let health;
let loadingHealth;

function getStat(apiBase, role) {
  api.getStat(apiBase).then(({ data }) => {
    axios.put(`${firebase}/${role}.json`, data);
  });
}

function resolveChannel(apiBase, onSuccess = _.noop) {
  console.log(`resolve payment at ${new Date()}`);

  return api.resolveChannel(apiBase).then(onSuccess);
}

function sendUserPay() {
  console.log(`Send user payment at ${new Date()}`);
  return api
    .sendPay(user.apiBase, provider.address, user.queryResult)
    .then(() => {
      setTimeout(() => {
        resolveChannel(user.apiBase, sendUserPay);
      }, TIMEOUT);
    });
}

function sendProviderPay() {
  console.log(`Send provider payment at ${new Date()}`);

  return api
    .sendPay(provider.apiBase, user.address, provider.queryResult)
    .then(() => {
      setTimeout(() => {
        resolveChannel(provider.apiBase, sendProviderPay);
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
          resolveChannel(user.apiBase);
          resolveChannel(provider.apiBase);
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
  sendUserPay();
  sendProviderPay();

  setInterval(checkHealth, 1000);
  setInterval(() => {
    getStat(provider.apiBase, 'provider');
    getStat(user.apiBase, 'user');
  }, 5000);
}

main();
