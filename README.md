# Metacrafters ATM

This project demonstrates a simple ATM functionality using Solidity smart contracts and a React frontend. Users can connect their MetaMask wallet to interact with the smart contract, allowing them to deposit, withdraw, send money to another account, and check their balance.

## Features

- **Deposit**: Allows users to deposit ETH into the contract.
- **Withdraw**: Allows users to withdraw ETH from the contract.
- **Send Money**: Allows the owner to send ETH to another account.
- **Check Balance**: Allows users to check their balance.
- **Check Ownership**: Allows users to check if the connected account is the owner of the contract.
- **Close Contract**: Allows the owner to self-destruct the contract and transfer remaining funds to the owner's address.

## Prerequisites

- Node.js and npm installed
- MetaMask wallet installed in your browser
- A local Ethereum development network (e.g., Hardhat)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arushtripathi121/ETH-AVAX-proof-2.git
   cd ETH-AVAX-proof-2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Compile the contract**:
   ```bash
   npx hardhat compile
   ```

4. **Deploy the contract**:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

   Note: Ensure you have a local Ethereum network running. You can use Hardhat's built-in network by running:
   ```bash
   npx hardhat node
   ```

5. **Update the contract address**:
   Copy the deployed contract address and update the `contractAddress` variable in the `HomePage` component.

## Running the Frontend

1. **Start the React app**:
   ```bash
   npm run dev
   ```

2. **Open your browser**:
   Navigate to `http://localhost:3000` to view the app.

## Usage

1. **Connect MetaMask**:
   - Ensure MetaMask is installed in your browser.
   - Connect your wallet to the app.

2. **Interact with the Contract**:
   - **Deposit**: Click on the "Deposit 1 ETH" button to deposit 1 ETH into the contract.
   - **Withdraw**: Click on the "Withdraw 1 ETH" button to withdraw 1 ETH from the contract.
   - **Send Money**: (Only for the owner) Click on the "Send 1 ETH to another account" button to send 1 ETH to a specified account.
   - **Close Contract**: (Only for the owner) Click on the "Close Contract" button to self-destruct the contract.

## File Structure

- `contracts/Assessment.sol`: Solidity smart contract for the ATM.
- `scripts/deploy.js`: Deployment script for the contract.
- `pages/index.js`: Main React component for the frontend.

