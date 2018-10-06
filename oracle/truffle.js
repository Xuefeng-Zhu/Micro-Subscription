const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic =
  'kitchen dish narrow reject across kiwi style segment patrol dutch much odor expect enjoy actress';

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      gas: 6500000,
      network_id: "*" // match any network
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          'https://ropsten.infura.io/v3/59ce8e43e116409fa8ddaa7494ea7805'
        );
      },
      network_id: 3,
      gas: 4600000
    }
  },
  solc: { optimizer: { enabled: true, runs: 200 } }
};
