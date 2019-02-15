const Web3 = require('web3');
const wallet = require('ethereumjs-wallet');
const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
const config = require('./config');

const { infura } = config;
const provider = new HDWalletProvider(infura.mnemonic, infura.url);
const web3 = new Web3(provider);

function generateKey(role) {
  const roleWallet = wallet.generate();
  const keyStore = roleWallet.toV3String('123456');

  fs.writeFileSync(`./celer/${role}_key.json`, keyStore);

  const address = roleWallet.getAddressString();
  web3.eth.sendTransaction({
    from: infura.account,
    to: address,
    value: web3.utils.toWei('1'),
    gas: 200000
  });
}

generateKey('user');
generateKey('provider');
provider.engine.stop();
