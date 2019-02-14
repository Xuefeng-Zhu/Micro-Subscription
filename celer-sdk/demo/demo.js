const celer = require('../browser/browser'); // '../dist/index' for NodeJS

const client = new celer.Client('http://localhost:29980');
const client1 = new celer.Client('http://localhost:29979');

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async function() {
  const channelID = await client.openEthChannel('100', '100');
  await client1.openEthChannel('100', '100')
  console.log('channel', channelID, 'has been opened');
  const balanceBefore = await client.getEthBalance();
  console.log('balance before', balanceBefore);
  await client.sendEth('1', 'c530a9eaecc08601dc233e5db7293636a630b2d1');
  await timeout(3000);
  const balanceAfter = await client.getEthBalance();
  console.log('balance after', balanceAfter);
})().catch(console.log);