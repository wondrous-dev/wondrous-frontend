import {
  Arbitrum,
  Binance,
  Boba,
  Ethereum,
  Avalanche,
  Optimism,
  Klaytn,
  Harmony,
  GnosisChain,
  Matic,
  USDCoin,
  WonderCoin,
  Aurora,
  BaseCoin,
  Linea,
  Ronin
} from "components/Icons/web3";

export enum SupportedChainType {
  ETH = "eth", // should be evm
}
const SUPPORTED_CHAINS = {
  1: "ethereum",
  137: "polygon",
  1666600000: "harmony",
  42161: "arbitrum",
  56: "bsc",
  288: "boba",
  10: "optimism",
  8217: "klaytn",
  43114: "avalanche",
  100: "gnosis",
  1313161554: "aurora",
  5: "goerli",
  8453: "base",
  59144: "linea",
  2020: "ronin",
};

export const RPC_URLS: { [chainId: number]: string } = {
  1: import.meta.env.VITE_URL_ETH,
  5: import.meta.env.VITE_URL_GOERLI,
  137: import.meta.env.VITE_URL_MATIC,
  1666600000: import.meta.env.VITE_URL_HARMONY,
  42161: import.meta.env.VITE_URL_ARBITRUM,
  56: import.meta.env.VITE_URL_BSC,
  288: import.meta.env.VITE_URL_BOBA,
  10: import.meta.env.VITE_URL_OPTIMISM,
  43114: import.meta.env.VITE_URL_AVALANCHE,
  1313161554: "https://mainnet.aurora.dev",
  8453: "https://base.llamarpc.com",
  59144: "https://rpc.linea.build",
  2020: 'https://proxy.roninchain.com/ronin'
};

export const CHAIN_TO_CHAIN_DIPLAY_NAME = {
  ethereum: "Ethereum Mainnet",
  goerli: "Goerli Testnet",
  polygon: "Polygon Mainnet",
  harmony: "Harmony Mainnet",
  arbitrum: "Arbitrum One",
  bsc: "BNB chain",
  boba: "Boba Mainnet",
  optimism: "Optimism Mainnet",
  klaytn: "Klaytn Mainnet",
  avalanche: "Avalanche",
  gnosis: "Gnosis Chain",
  aurora: "Aurora",
  base: "Base",
  linea: "Linea",
  ronin: "Ronin",
};

export const CHAIN_TO_EXPLORER_URL = {
  ethereum: "https://etherscan.io",
  goerli: "https://goerli.etherscan.io",
  polygon: "https://polygonscan.com",
  harmony: "https://explorer.harmony.one",
  arbitrum: "https://arbiscan.io",
  bsc: "https://www.bscscan.com",
  boba: "https://bobascan.com",
  optimism: "https://optimistic.etherscan.io",
  klaytn: "https://scope.klaytn.com",
  avalanche: "https://snowtrace.io",
  gnosis: "https://gnosisscan.io",
  aurora: "https://explorer.mainnet.aurora.dev",
  base: "https://basescan.org",
  linea: "https://lineascan.build",
  ronin: "https://app.roninchain.com/",
};

export const CHAIN_VALUE_TO_GNOSIS_TX_SERVICE_URL = {
  ethereum: "https://safe-transaction-mainnet.safe.global",
  goerli: "https://safe-transaction-goerli.safe.global",
  polygon: "https://safe-transaction-polygon.safe.global",
  harmony: "https://transaction.multisig.harmony.one",
  arbitrum: "https://safe-transaction-arbitrum.safe.global",
  bsc: "https://safe-transaction-bsc.safe.global",
  boba: "https://safe-transaction.mainnet.boba.network",
  optimism: "https://safe-transaction-optimism.safe.global",
  avalanche: "https://safe-transaction-avalanche.safe.global",
  gnosis: "https://safe-transaction-gnosis-chain.safe.global",
  aurora: "https://safe-transaction-aurora.safe.global",
};

if (!import.meta.env.VITE_PRODUCTION) {
  SUPPORTED_CHAINS[5] = "goerli";
}

export const SUPPORTED_CHAIN_IDS = Object.keys(SUPPORTED_CHAINS).map((chainId) => parseInt(chainId, 10));

export const DEFAULT_ERC20_GAS_LIMIT = "0x3D090"; // TODO hackey == 250000

const CHAIN_SELECT_OPTIONS = [
  { label: "Ethereum", value: "ethereum", icon: <Ethereum /> },
  { label: "Polygon", value: "polygon", icon: <Matic /> },
  { label: "Optimism", value: "optimism", icon: <Optimism /> },
  { label: "Arbitrum", value: "arbitrum", icon: <Arbitrum /> },
  { label: "BSC", value: "bsc", icon: <Binance /> },
  // { label: "Klaytn", value: "klaytn", icon: <Klaytn /> },
  // { label: "Gnosis", value: "gnosis", icon: <GnosisChain /> },
  { label: "Avalanche", value: "avalanche", icon: <Avalanche /> },
  // { label: "Harmony", value: "harmony", icon: <Harmony /> },
  // { label: "Boba", value: "boba", icon: <Boba /> },
  { label: "Linea", value: "linea", icon: <Linea /> },
  {
    label: "Base",
    value: "base",
    icon: <BaseCoin />,
  },
  { label: "Aurora", value: "aurora", icon: <Aurora /> },
  { label: "Ronin", value: "ronin", icon: <Ronin /> },
];

if (!import.meta.env.VITE_PRODUCTION) {
  CHAIN_SELECT_OPTIONS.push({
    label: "Goerli Testnet",
    value: "goerli",
    icon: <Ethereum />,
  });
}

export function signedMessageIsString(message: string | boolean): message is string {
  return typeof message === "string";
}

const SUPPORTED_CHAINS_META = [
  {
    chainId: 1,
    name: "Ethereum Mainnet",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: import.meta.env.VITE_URL_ETH,
  },
  ...(import.meta.env.VITE_PRODUCTION
    ? []
    : [
        {
          chainId: 5,
          name: "Goerli",
          currency: "ETH",
          explorerUrl: "https://goerli.etherscan.io",
          rpcUrl: import.meta.env.VITE_URL_GOERLI,
        },
      ]),
  {
    chainId: 137,
    name: "Polygon Mainnet",
    currency: "MATIC",
    explorerUrl: "https://polygonscan.com",
    rpcUrl: import.meta.env.VITE_URL_MATIC,
  },
  {
    chainId: 1666600000,
    name: "Harmony Mainnet",
    currency: "ONE",
    explorerUrl: "https://explorer.harmony.one",
    rpcUrl: import.meta.env.VITE_URL_HARMONY,
  },
  {
    chainId: 42161,
    name: "Arbitrum One",
    currency: "ETH",
    explorerUrl: "https://arbiscan.io",
    rpcUrl: import.meta.env.VITE_URL_ARBITRUM,  
  },
  {
    chainId: 56,
    name: "BSC Mainnet",
    currency: "BNB",
    explorerUrl: "https://www.bscscan.com",
    rpcUrl: import.meta.env.VITE_URL_BSC,
  },
  {
    chainId: 288,
    name: "Boba Mainnet",
    currency: "BOBA",
    explorerUrl: "https://bobascan.com",
    rpcUrl: import.meta.env.VITE_URL_BOBA,
  },
  {
    chainId: 10,
    name: "Optimism Mainnet",
    currency: "ETH",
    explorerUrl: "https://optimistic.etherscan.io",
    rpcUrl: import.meta.env.VITE_URL_OPTIMISM,
  },
  {
    chainId: 43114,
    name: "Avalanche",
    currency: "AVAX",
    explorerUrl: "https://snowtrace.io",
    rpcUrl: import.meta.env.VITE_URL_AVALANCHE,

  },
  {
    chainId: 1313161554,
    name: "Aurora",
    currency: "ETH",
    explorerUrl: "https://explorer.mainnet.aurora.dev",
    rpcUrl: "https://mainnet.aurora.dev",
  },
  {
    chainId: 8453,
    name: "Base",
    currency: "ETH",
    explorerUrl: "https://basescan.org",
    rpcUrl: "https://base.llamarpc.com",
  },
  {
    chainId: 59144,
    name: "Linea",
    currency: "ETH",
    explorerUrl: "https://lineascan.build",
    rpcUrl: "https://rpc.linea.build",
  },
  {
    chainId: 2020,
    name: "Ronin",
    currency: "RON",
    explorerUrl: "https://app.roninchain.com/",
    rpcUrl: "https://proxy.roninchain.com/ronin",
  }
];

export { SUPPORTED_CHAINS, CHAIN_SELECT_OPTIONS, SUPPORTED_CHAINS_META };
