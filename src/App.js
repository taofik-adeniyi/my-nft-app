import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myNFTAbi from "./lib/myNFT/myNFT.json"

// Constants
const TWITTER_HANDLE = '3rixs';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  /*
    * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
    */
    const [currentAccount, setCurrentAccount] = useState("");

   const checkIfWalletIsConnected = async () => {
    /*
    * First make sure we have access to window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

     /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      /*
      * User can have multiple authorized accounts, we grab the first one if its there!
      */
      if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account)
      } else {
          console.log("No authorized account found")
      }
  }

   /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      // let chainId = await ethereum.request({ method: 'eth_chainId' });
      // console.log("Connected to chain " + chainId);

      // // String, hex code of the chainId of the Rinkebey test network
      // const rinkebyChainId = "0x4"; 
      // if (chainId !== rinkebyChainId) {
      //   alert("You are not connected to the Rinkeby Test Network!");
      // }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const mintMyNFT = async () => {
  const CONTRACT_ADDRESS = "0xC248fecCc6282A578fB800ed36B6f7fB5894B8ac";
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNFTAbi.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeMyNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
        <h1 style={{color: 'white'}}>Combination of foods, soups,names in Nigeria</h1>
          <p className="header gradient-text">SQUARE NFT Collection's</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          
          {currentAccount === "" ? (
            <button onClick={connectWallet} className="cta-button connect-wallet-button">
              Connect to Wallet
            </button>
          ) : (
            <button onClick={mintMyNFT} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE} on buildspace`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
