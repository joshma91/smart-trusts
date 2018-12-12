var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var SmartTrust = artifacts.require("./SmartTrust.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(SmartTrust);
};
