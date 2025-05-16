# WORKLOB

WorkLob is the ultimate decentralized platform connecting job seekers, employers, and freelancers, enhanced with AI-powered agents to assist users in completing specialized tasks — WorkLob combines blockchain technology with AI to bring everything about jobs and opportunities into one seamless experience.

## Features

- **Client and Talent Collaboration**:  
  Seamless interaction between clients and talents, allowing users to easily switch roles, create job offers, gigs, and manage transactions securely.

- **Job Mining (Staking LOB)**:  
  WorkLob platform incorporates a DAO token, enabling users to stake LOB and earn rewards from the platform's profits, fostering decentralized participation and incentives.

- **Multiple AI Services**:  
  Access various AI-powered tools, including code assistants, image generators, text analyzers, and more, to enhance productivity and automation.

- **Micropayments**:  
  Pay small amounts of ETH for each service use, ensuring cost efficiency and flexibility.

- **Blockchain Integration**:  
  A transparent and secure payment system powered by Base blockchain, ensuring trustless and immutable transactions.

- **Streaming Responses**:  
  Real-time responses for text-based services, ensuring a seamless experience with instant AI-generated results.

- **Governance**:  
  Decentralized decision-making and voting mechanisms within the WorkLob DAO, allowing stakeholders to influence platform direction and updates.

- **Trading with AI Agent**:  
  Leverage AI-driven trading agent for automated strategies, data-driven insights, and fast market execution.

- **Lending and Borrowing**:  
  Decentralized finance (DeFi) solutions enabling users to lend or borrow assets securely with smart contract automation.

## Project Structure

- `/src`: React.js application with the WebApp UI
- `/backend`: Node.js API server that handles data flow and some AI service execution
- `/smart-contracts`: Solidity smart contracts for handling ETH payments

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) v16 or later
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MetaMask](https://metamask.io/) browser extension (Not needed for smart wallet users)
- BASE tokens (testnet or mainnet, depending on deployment)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Tolujoh-n/worklob-webApp
cd worklob-webApp
```

### 2. Install Dependencies

```bash

# Install frontend dependencies
npm install --legacy-peer-deps

# Install backend dependencies
cd backend
npm install
cd ..

# Install contract dependencies
cd smart-contracts
npm install
cd ..

```

### 3. Set Up Environment Variables

The project uses environment files to configure different deployment environments. You'll need to set up these files:

#### Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set the following variables:

- `REACT_APP_GOOGLE_API_KEY`: Your Google-gimini API key

#### Frontend Configuration

```bash
cp .env.example .env.local
```

Edit `.env.local` and set the following variables:

- `REACT_APP_GOOGLE_API_KEY`: Your Google-gimini API key
- `REACT_PUBLIC_PAYMASTER_PROXY_SERVER_URL`: To use Paymaster service

#### Contracts Configuration

```bash
cd smart-contract
cp .env.example .env
```

Edit `.env` and set the following variables:

- `MNEMONIC`: Your wallet's pass phrase (for contract deployment)

### 4. Deploy Smart Contract

You need to deploy the smart contract to the Base blockchain:

```bash
cd smart-contract

# Install needed deps
npm install --save @truffle/hdwallet-provider
npm install --save dotenv
npm install --save @openzeppelin/contracts

# Compile the contract
truffle compile

# Deploy to testnet (default)
truffle migrate --network baseTestnet

```

After deployment, save the contract address and update the constant file at `src/components/Constants.js` files.

### 6. Start Development Servers

In separate terminal windows, start the frontend and backend servers:

```bash

# Start frontend server (http://localhost:3000)
npm start

# Start backend server (http://localhost:8080)
cd backend
npm start

```

Now, you can access the home of Work "WORKLOB" at [http://localhost:3000](http://localhost:3000)

## Using the Worklob WebApp

### 1. Register and Connect Your Wallet

1. Visit [http://localhost:3000](http://localhost:3000)
2. Click "Login" or "Register" If your did not have a account
3. Approve the connection in Smart wallet or MetaMask for wallet registration
4. If prompted, switch to the Base network

### 2. Set Up Base Network in MetaMask

If you haven't added the Base network to MetaMask, the app will prompt you to add it. Alternatively, you can add it manually:

#### Base Testnet

- Network Name: Base Sepolia
- RPC URL: https://sepolia.base.org
- Chain ID: 84532
- Currency Symbol: ETH
- Block Explorer URL: https://sepolia-explorer.base.org

#### Base Mainnet

- Network Name: Base Mainnet
- RPC URL: https://mainnet.base.org
- Chain ID: 8453
- Currency Symbol: ETH
- Block Explorer URL: https://base.blockscout.com

### 3. Getting Testnet ETH

For testing on testnet, you can get free testnet ETH from:

- Base Testnet Faucet: https://docs.base.org/chain/network-faucets
- Contact the Base community or team for testnet tokens

## 4. Client and Customer Collaboration

Users can seamlessly switch between roles as a Talent or Customer at any time using the role-switching button in the dropdown menu located at the profile icon in the top-right corner.

1. **Job Creation:**

   - Customers can create job offers, whether for freelance or part-time work.
   - Talents can create gigs for customers to discover and engage with.

2. **Job & Gig Interaction:**

   - Customers can offer jobs or gigs to talents by clicking the "Offer" button.
   - A secure payment system allows customers to deposit job funds into escrow via the "Deposit" button within the chat interaction page.

3. **Job Progression:**

   - Talents can update the job or gig status to **"In Progress"** upon starting the task.
   - Upon completion, they can mark it as **"Completed"**, signing the transaction to update the blockchain with job progress details.

4. **Payment Release:**
   - Customers can release funds to the talent by clicking the **"Confirm"** button, finalizing the transaction and updating the job status on the blockchain.

This streamlined system ensures smooth collaboration between customers and talents while maintaining transactional transparency through blockchain technology.

### 5. Using AI Services

1. Browse the available AI Agent services on the marketplace AI Agent navigation
2. Click on a service to view details
3. Enter your input or upload a file (.txt supported)
4. Click "Process" and confirm the ETH payment in Smart wallet or MetaMask
5. Wait for the transaction to be confirmed on the blockchain
6. View your results and download if applicable

## Troubleshooting

### MetaMask Connection Issues (For Metamask wallet users)

- Ensure MetaMask is unlocked
- Check that you're connected to the correct Base network
- Try refreshing the page or disconnecting and reconnecting

### Transaction Failures

- Ensure you have enough ETH for gas fees plus the service cost
- Check that the contract addresses src/components/constants.js in your frontend file matches the deployed contract

### Backend API Errors

- Check that your Google-gimini API key is valid
- Ensure the backend is running and accessible from the frontend

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Quick Links:

- WhitePaper: https://docs.google.com/document/d/1eSffapuMNv2RsnZKFVqBN0wbX-oP0-eaVAjt1sLYCdo/edit?usp=sharing
- Landing Page: https://worklob.netlify.app/
- Video Demo:https://youtu.be/tPJVEbSilow
- WebAPP (Testnet): https://worklobapp.netlify.app/
- Follow on X: https://x.com/worklob_global?s=21
- Discord: https://discord.gg/CBQmQgeYkp

## Acknowledgments

- Base for the blockchain platform
- Google-gimini for the AI APIs
