// eslint-disable-next-line no-undef
const LOBToken = artifacts.require("LOBToken");

module.exports = async (deployer) => {
  const initialSupply = 1000000; // Initial supply of 1,000,000 LOB
  await deployer.deploy(LOBToken, initialSupply);
};
