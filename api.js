const axios = require('axios');
const config = require('./config');
const Web3 = require('web3');

const { amount, firebase, oracle, frequency } = config;
const oracleABI =
  '[{"constant":true,"inputs":[{"name":"_query","type":"bytes"},{"name":"_timeout","type":"uint256"}],"name":"isFinalized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_query","type":"bytes"}],"name":"queryResult","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]';

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

exports.getStat = function(client) {
  return client.getBalance('0', '0');
};

exports.sendPay = function(client, dst, queryResult) {
  const now = Math.floor(new Date() / 1000);

  return client.registerOracle(oracle, oracleABI).then(() => {
    const web3 = new Web3(config.infura.url);

    web3.eth.getBlockNumber().then(blockNumber => {
      const condition = {
        sessionID: oracle,
        argsForQueryResult: queryResult,
        argsForIsFinalized: numberToBytes(now + frequency - 1),
        onChainDeployed: true,
        deadline: String(blockNumber + 10)
      };
      client.sendEthWithCondition(amount, dst, condition);
    });
  });
};

exports.resolveChannel = function(client) {
  return client.resolveOracleForEth(oracle);
};

exports.checkHealth = function() {
  return axios.get(`${firebase}/health.json`);
};
