// eslint-disable-next-line no-undef
const WorklobAIMarketplace = artifacts.require("WorklobAIMarketplace");

module.exports = function (deployer) {
  deployer.deploy(WorklobAIMarketplace);
};
