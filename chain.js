#!/usr/bin/env node

const contract = require("truffle-contract");
const HDWalletProvider = require("truffle-hdwallet-provider");

const contractAbi = require("./oracle/build/contracts/ChainCloud.json");
const config = require("./config");
const { oracle, infura } = config;

const provider = new HDWalletProvider(infura.mnemonic, infura.url);
const ChainHost = contract(contractAbi);
ChainHost.setProvider(provider);

exports.updateUptime = function() {
  return ChainHost.at(config.oracle).then(function(instance) {
    return instance.updateUptime({
      from: infura.account,
      gas: 200000
    });
  });
};

exports.uptime = function() {
  return ChainHost.at(config.oracle).then(function(instance) {
    return instance.uptime.call();
  });
};
