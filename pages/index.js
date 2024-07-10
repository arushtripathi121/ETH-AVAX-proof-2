import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [isOwner, setIsOwner] = useState(false);

  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account.length > 0) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
      getATMContract(account[0]);
    } else {
      console.log("No account found");
    }
  }

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
  };

  const getATMContract = async (account) => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);

    // Check if the connected account is the owner
    const owner = await atmContract.isOwner(account);
    setIsOwner(owner);

    // Get balance
    const balance = await atmContract.getBalance();
    setBalance(balance.toNumber());
  }

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  }

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  }

  const sendMoney = async (recipientAddress, amount) => {
    if (atm) {
      let tx = await atm.sendMoney(recipientAddress, ethers.utils.parseEther(amount));
      await tx.wait();
      getBalance();
    }
  }

  const closeContract = async () => {
    if (atm) {
      let tx = await atm.close();
      await tx.wait();
    }
  }

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        {isOwner && (
          <>
            <button onClick={() => sendMoney("recipient_address_here", "1")}>Send 1 ETH to another account</button>
            <button onClick={closeContract}>Close Contract</button>
          </>
        )}
      </div>
    )
  }

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          margin: 0 auto;
          padding: 20px;
          max-width: 600px;
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #72EDF2 10%, #5151E5 100%);
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
          color: #fff;
        }
        header {
          margin-bottom: 20px;
        }
        h1 {
          font-size: 26px;
          color: #fff;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }
        p {
          font-size: 18px;
          color: #f0f0f0;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }
        button {
          background-color: #ff9800;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border-radius: 5px;
          margin: 5px;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #e68a00;
        }
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        div {
          margin-top: 20px;
        }
      `}
      </style>
    </main>
  )
}
