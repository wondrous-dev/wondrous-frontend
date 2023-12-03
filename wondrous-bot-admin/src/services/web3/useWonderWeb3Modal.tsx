import { ethers } from "ethers";
import { TransactionData, WonderWeb3AssetMap } from "./types";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
  useDisconnect,
  useWeb3Modal,
  useWeb3ModalEvents,
} from "@web3modal/ethers5/react";
import { useMemo, useState } from "react";
import { SUPPORTED_CHAIN_IDS } from "utils/web3Constants";

const useWonderWeb3Modal = () => {
  const { chainId, isConnected, address } = useWeb3ModalAccount();

  const { walletProvider } = useWeb3ModalProvider();

  const { disconnect } = useDisconnect();
  const [assets, setAssets] = useState<WonderWeb3AssetMap>(null);
  const [ensName, setENSName] = useState(null);

  const { open, close } = useWeb3Modal();

  const { data } = useWeb3ModalEvents();

  const sendTransaction = async (txData: TransactionData) => {
    const prov = new ethers.providers.Web3Provider(walletProvider);
    const signer = prov.getSigner();
    const transactionObj = await signer.sendTransaction(txData);
    return transactionObj;
  };

  const getAddressFromENS = async (ens: string) => {
    try {
      const prov = new ethers.providers.Web3Provider(walletProvider);
      const address = await prov.resolveName(ens);
      return address;
    } catch (err) {
      return null;
    }
  };

  const getGasPrice = async () => {
    try {
      const prov = new ethers.providers.Web3Provider(walletProvider);
      return await prov.getGasPrice();
    } catch (err) {
      return null;
    }
  };
  const getENSName = async () => {
    // If chain supports ENS...
    try {
      const prov = new ethers.providers.Web3Provider(walletProvider);
      const name = await prov.lookupAddress(address);
      setENSName(name);
    } catch (err) {
      // Chain not supported. No problem
      setENSName(null);
    }

    return true;
  };

  const getENSNameFromEthAddress = async (address: string) => {
    try {
      if (!walletProvider) {
        console.warn("No provider found");
        return;
      }
      const prov = new ethers.providers.Web3Provider(walletProvider);
      const name = await prov.lookupAddress(address);
      return name;
    } catch (err) {
      console.log("Error getting ENS name", err);
      return null;
    }
  };

  const checkedAddress: string = useMemo(() => (address ? ethers.utils.getAddress(address) : null), [address]);

  const signMessage = async (message: string) => {
    if (!walletProvider || !isConnected) return;
    try {
      const prov = new ethers.providers.Web3Provider(walletProvider);
      if (!SUPPORTED_CHAIN_IDS[chainId]) {
        disconnect();
        return false;
      }
      const signer = prov.getSigner();

      // Now sign message
      const signedMessage = await signer.signMessage(message);
      const recoverMessage = ethers.utils.verifyMessage(message, signedMessage);
      // setConnecting(false);
      return signedMessage;
    } catch (error) {
      // Error Signed message
      // setConnecting(false);
      if (error.code && error.code == 4001) {
        return false;
      }
    }
    return null;
  };

  return {
    chainId,
    isConnected,
    address: checkedAddress,
    disconnect,
    walletProvider,
    assets,
    setAssets,
    sendTransaction,
    getENSName,
    getENSNameFromEthAddress,
    getAddressFromENS,
    getGasPrice,
    ensName,
    open,
    eventsData: data,
    lastEvent: data?.event,
    signMessage,
    closeWeb3Modal: close,
  };
};

export default useWonderWeb3Modal;
