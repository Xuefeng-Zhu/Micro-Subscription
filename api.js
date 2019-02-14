const axios = require('axios');
const web3 = require('web3');
const config = require('./config');

const { amount, firebase, oracle, frequency } = config;
const oracleABI = '[{"constant":true,"inputs":[{"name":"_query","type":"bytes"},{"name":"_timeout","type":"uint256"}],"name":"isFinalized","outputs":[{"name":","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_query","type":"bytes"}],"name":"queryResult","outputs":[{"name":","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]'

function numberToBytes(long) {
  // we want to represent the input as a 8-bytes array
  var bytes = [0, 0, 0, 0, 0, 0, 0, 0];

  for (var index = 0; index < bytes.length; index++) {
    var byte = long & 0xff;
    bytes[index] = byte;
    long = (long - byte) / 256;
  }

  return Uint8Array.from(bytes);
}

function formatSessoin(oracle) {
  const bytes = web3.utils.hexToBytes(oracle);

  while (bytes.length < 32) {
    bytes.unshift(0);
  }

  return web3.utils.bytesToHex(bytes).slice(2);
}

exports.getStat = function(client) {
  return client.getBalance('0', '0');
};

exports.sendPay = function(client, dst, queryResult) {
  const now = Math.floor(new Date() / 1000);

  return client.registerOracle(oracle, oracleABI)
    .then(() => {
      const condition = {
        sessionID: formatSessoin(oracle),
        argsForQueryResult: queryResult,
        argsForIsFinalized: numberToBytes(now + frequency - 1),
        onChainDeployed: true,
        deadline: '10'
      }

      return client.sendConditionalPayment('0', '0', amount, dst, condition);
    });
};

exports.resolveChannel = function(client) {
  return client.resolveOracleForEth(oracle);
};

exports.checkHealth = function() {
  return axios.get(`${firebase}/health.json`);
};
