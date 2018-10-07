try {
  var userKey = require('../../celer/user_key.json');
  var providerKey = require('../../celer/provider_key.json');
} catch {
  var userKey = {};
  var providerKey = {};
}

export default {
  oracle: '0x3ec64fb2b9430b7475380017019d5182c226bbf8',
  firebase: 'https://chaincloud-a384b.firebaseio.com',
  user: {
    address: userKey.address,
    apiBase: 'http://localhost:8081',
    queryResult: [1]
  },
  provider: {
    address: providerKey.address,
    apiBase: 'http://localhost:8082',
    queryResult: [0]
  },
  amount: '1',
  frequency: 20,
  infura: {
    url: 'https://ropsten.infura.io/v3/59ce8e43e116409fa8ddaa7494ea7805',
    mnemonic: 'kitchen dish narrow reject across kiwi style segment patrol dutch much odor expect enjoy actress',
    account: '0x4b74cf3ef96b6eb7f1e73613e0c7f732deb8f483'
  }
};
