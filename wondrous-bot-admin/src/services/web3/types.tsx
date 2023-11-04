import { AbstractConnector } from "@web3-react/abstract-connector";
import { ethers, BigNumber } from "ethers";

export interface WonderWeb3Asset {
  balance: string;
  symbol: string;
}

export interface WonderWeb3AssetMap {
  [symbol: string]: WonderWeb3Asset;
}

export interface TransactionData {
  gasPrice: string;
  gasLimit: string;
  to: string;
  from: string;
  value: string;
  data: string;
  chainId?: number;
}
export interface WonderWeb3 {
  /**
   * If true, we are either connecting to a web3 provider or waiting for a user signature
   */
  connecting: boolean;

  wallet: {
    /**
     * The connected wallet address
     */
    account: string;

    /**
     * Alias for account
     */
    address: string;

    /**
     * The connected chain id
     */
    chain: number;

    /**
     * Abbreviated form of the address
     */
    addressTag: string;

    /**
     * Currencies held by current wallet
     */
    assets: WonderWeb3AssetMap;
  };

  /**
   * The address of the connected account
   */
  address: string;

  /**
   * Currencies held by the current wallet
   */
  assets: WonderWeb3AssetMap;

  /**
   * The ensName
   */
  ensName: String;

  /**
   * The connected chain id
   */
  chain: number;

  /**
   * The connected chain name
   */
  chainName: string;

  /**
   * True after we have subscribed to the provider events
   */
  subscribed: boolean;

  /**
   * True if the current chain is not supported by wonderverse.
   */
  notSupportedChain: boolean;

  /**
   * Method to reactivate a connection to a connector. Do not call before activating a connector (using method active).
   * To activate a connector, you can use the helper components at components/WalletConnectors.
   */
  onConnect: () => void;

  /**
   * Deactivates the current connector
   */
  disconnect: () => boolean;

  /**
   * Signs the given message using the connected account.
   * Returns the signed message if the signature was valid.
   * Returns false if there was any errors while signing.
   */
  signMessage: (message: string) => Promise<string | boolean>;

  web3Provider: any;

  /**
   * Returns the checksum address of the given address.
   */
  toChecksumAddress: (string) => string;

  /**
   * Checks validity of a given address.
   */
  isValidAddress: (string) => boolean;

  connector: AbstractConnector;
  error: Error;

  /**
   * True while activating a connector
   */
  isActivating: boolean;

  /**
   * True after the activation of a connector
   */
  active: boolean;
  library: ethers.providers.Web3Provider;

  /**
   * Activates a connector
   */
  activate: (connector: AbstractConnector, done?: () => void) => void;

  /**
   * Activates a connector by name and stores it to local storage to be used on session reload.
   */
  activateAndStore: (connectorName: string) => void;

  /**
   * Resolves ENS Name from provided eth address.
   */
  getENSNameFromEthAddress: (address: string) => Promise<string | null>;

  /**
   * Resolves eth address from provided ENS Name
   */
  getAddressFromENS: (address: string) => Promise<string | null>;

  /**
   * get gas price from provider
   */
  getGasPrice: () => Promise<BigNumber | null>;

  /**
   * sign and send transaction
   */
  sendTransaction: (txData: TransactionData) => Promise<any | null>;
}
