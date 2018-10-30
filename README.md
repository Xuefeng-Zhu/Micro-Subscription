# Micro Subscription

A new payment and dispute solution for cloud service. Users are able to make micro payment for the service they actually use by minutes. It also uses on-chain oracle to monitor the service status. If the service is always on within a minute, user will pay the service provider. If the service goes down, user does not need to pay the service provider, and the service provider will pay the user instead for its lost based on SLA.

## Instruction

1. Update `config.js` with your own configuration
2. Run `npm install` and then `node generate-keys.js` to have your key store generated
3. Go to celer directory, and start two celer client, one for user and one for service provider. To start celer client, run `./celer_client -p 8081 -w 123456 -k user.json` and `./celer_client -p 8082 -w 123456 -k provider.json`
4. Run `node index.js` to launch node client, which will trigger state channel payment and monitor service status
5. Go to dashboard, run `npm install & npm start` to launch a simple statistics dashboard.

