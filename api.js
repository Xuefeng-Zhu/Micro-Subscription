const axios = require('axios');
const config = require('./config');

const { amount, firebase, oracle, frequency } = config;

function numberToBytes(long) {
  // we want to represent the input as a 8-bytes array
  var bytes = [0, 0, 0, 0, 0, 0, 0, 0];

  for (var index = 0; index < bytes.length; index++) {
    var byte = long & 0xff;
    bytes[index] = byte;
    long = (long - byte) / 256;
  }

  return bytes;
}

exports.getStat = function(apiBase) {
  return axios.post(`${apiBase}/stat`, {
    Option: 1
  });
};

exports.sendPay = function(apiBase, dst, queryResult) {
  const now = Math.floor(new Date() / 1000);
  return axios.post(`${apiBase}/sendPay`, {
    Dst: dst,
    Amount: amount,
    Dependency: oracle,
    QueryFinalization: numberToBytes(now + frequency),
    QueryResult: queryResult,
    Timeout: 10
  });
};

exports.resolveChannel = function(apiBase) {
  return axios.post(`${apiBase}/resolveChannel`, {
    Dependency: oracle
  });
};

exports.checkHealth = function() {
  return axios.get(`${firebase}/health.json`);
};
