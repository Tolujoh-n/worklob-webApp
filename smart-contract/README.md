# Worklob Contract

## Install

- `cd smart-contract`

```
npm install --save @truffle/hdwallet-provider
npm install --save dotenv
npm install --save @openzeppelin/contracts
```

## Deploy

- `truffle migrate --network baseTestnet`

- Deploy a specific contract by selecting it's migration number `truffle migrate --network baseTestnet --f 3 --to 3`

##

- LOB_TOKEN_ADDRESS: 0x8264029aC2f6eB8c3f67F6b872Ab649875B10cF4
- STAKING_ADDRESS: 0x4da51ebebBE767C4a1C370ed108E220086D6c5de
- WORKLOBJOB_ADDRESS:0x0c73edDb6326228B6E8F4Ffa3a95d3306DE95964
- AI_ADDRESS: 0x05A5B5f278d8Df7297b128D2C395A372DF7cDAeA

##

- Replace the Token contract address in the stacking and job_contract migration file if you redeploy the token contract. as the contract address will change

- And update your constants.js file in the frontend with the updated contract build and contract addresses
