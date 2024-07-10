import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [isOwner, setIsOwner] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      await getATMContract(accounts[0]);
    }
  };

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

    const ownerStatus = await atmContract.isOwner(account);
    setIsOwner(ownerStatus);

    const balance = await atmContract.getBalance();
    setBalance(balance.toNumber());
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      try {
        let tx = await atm.deposit(1);
        await tx.wait();
        await getBalance();
      } catch (error) {
        console.error("Deposit failed:", error);
      }
    }
  };

  const withdraw = async () => {
    if (atm) {
      try {
        let tx = await atm.withdraw(1);
        await tx.wait();
        await getBalance();
      } catch (error) {
        console.error("Withdraw failed:", error);
      }
    }
  };

  const sendMoney = async (recipientAddress, amount) => {
    if (atm) {
      try {
        let tx = await atm.sendMoney(recipientAddress, ethers.utils.parseEther(amount));
        await tx.wait();
        await getBalance();
      } catch (error) {
        console.error("Send money failed:", error);
      }
    }
  };

  const closeContract = async () => {
    if (atm) {
      try {
        let tx = await atm.close();
        await tx.wait();
      } catch (error) {
        console.error("Close contract failed:", error);
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        {isOwner && (
          <>
            <button onClick={() => sendMoney("recipient_address_here", "1")}>Send 1 ETH to another account</button>
            <button onClick={closeContract}>Close Contract</button>
          </>
        )}
      </div>
    );
  };

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}
      </style>
    </main>
  );
}
