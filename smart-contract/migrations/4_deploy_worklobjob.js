// eslint-disable-next-line no-undef
const WorklobJOB = artifacts.require("WorklobJOB");

module.exports = function (deployer) {
  deployer.deploy(WorklobJOB);
};
