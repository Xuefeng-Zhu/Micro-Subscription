var ChainCloud = artifacts.require("./ChainCloud.sol");

module.exports = function(deployer) {
  deployer.deploy(ChainCloud);
};
