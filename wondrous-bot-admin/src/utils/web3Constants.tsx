// import Arbitrum from 'components/Icons/arbitrum';
// import Binance from 'components/Icons/binance';
// import Boba from 'components/Icons/Boba';
// import Ethereum from 'components/Icons/ethereum';
// import Avalanche from 'components/Icons/avalanche';
// import Optimism from 'components/Icons/Optimism';
// import Klaytn from 'components/Icons/Klaytn';
// import Polygon from 'components/Icons/polygonMaticLogo.svg';
// import Harmony from 'components/Icons/harmony';
// import GnosisChain from 'components/Icons/GnosisChain';
// import { Matic } from 'components/Icons/matic';
// import { USDCoin } from 'components/Icons/USDCoin';
// import { WonderCoin } from 'components/Icons/wonderCoin';
// import Aurora from 'components/Icons/AuroraCoin.svg';

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
} from 'components/Icons/web3';
import Aurora from 'components/Icons/AuroraCoin.svg';

export enum SupportedChainType {
  ETH = 'eth', // should be evm
}
const SUPPORTED_CHAINS = {
  1: 'ethereum',
  137: 'polygon',
  1666600000: 'harmony',
  42161: 'arbitrum',
  56: 'bsc',
  288: 'boba',
  10: 'optimism',
  8217: 'klaytn',
  43114: 'avalanche',
  100: 'gnosis',
  1313161554: 'aurora',
};

export const NATIVE_TOKEN_SYMBOL = {
  1: 'ETH',
  4: 'ETH',
  137: 'MATIC',
  1666600000: 'ONE',
  42161: 'AETH',
  56: 'BNB',
  288: 'ETH',
  10: 'OP',
  8217: 'KLAY',
  43114: 'AVAX',
  100: 'xDai',
  1313161554: 'AURORA',
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
  1313161554: import.meta.env.VITE_URL_AURORA,
};

export const CHAIN_TO_CHAIN_DIPLAY_NAME = {
  ethereum: 'Ethereum Mainnet',
  goerli: 'Goerli Testnet',
  polygon: 'Polygon Mainnet',
  harmony: 'Harmony Mainnet',
  arbitrum: 'Arbitrum One',
  bsc: 'BNB chain',
  boba: 'Boba Mainnet',
  optimism: 'Optimism Mainnet',
  klaytn: 'Klaytn Mainnet',
  avalanche: 'Avalanche',
  gnosis: 'Gnosis Chain',
  aurora: 'Aurora',
};

export const SUPPORTED_CURRENCIES = [
  // this is stupid change it
  {
    symbol: 'ETH',
    chains: [1, 4, 288],
  },
  {
    symbol: 'MATIC',
    chains: [137],
  },
  {
    symbol: 'ONE',
    chains: [1666600000],
  },
  {
    symbol: 'AETH',
    chains: [42161],
  },
  {
    symbol: 'BNB',
    chains: [56],
  },
  {
    symbol: 'OP',
    chains: [10],
  },
  {
    symbol: 'KLAY',
    chains: [8217],
  },
  {
    symbol: 'WONDER',
    chains: [1, 137, 1666600000, 42161, 56, 288, 10, 8127],
    contracts: {
      1: '',
      137: '',
      1666600000: '',
      42161: '',
      56: '',
      288: '',
      10: '',
      8127: '',
    },
  },
  {
    symbol: 'USDC',
    chains: [1, 137, 1666600000, 42161, 288, 10],
    contracts: {
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      1666600000: '0x44cED87b9F1492Bf2DCf5c16004832569f7f6cBa',
      42161: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      56: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      288: '0x66a2A913e447d6b4BF33EFbec43aAeF87890FBbc',
      10: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    },
  },
];

export const CHAIN_TO_GNOSIS_URL_ABBR = {
  ethereum: 'eth',
  goerli: 'gor',
  polygon: 'matic',
  bsc: 'bnb',
  arbitrum: 'arb1',
  optimism: 'opt',
  avalanche: 'avax', // TODO check thisis right
  gnosis: 'gno', // TODO check thisis right
  aurora: 'aurora',
};

export const LIT_PROTOCOL_MESSAGE = 'signature verification to token gating';

export const CHAIN_TO_EXPLORER_URL = {
  ethereum: 'https://etherscan.io',
  goerli: 'https://goerli.etherscan.io',
  polygon: 'https://polygonscan.com',
  harmony: 'https://explorer.harmony.one',
  arbitrum: 'https://arbiscan.io',
  bsc: 'https://www.bscscan.com',
  boba: 'https://bobascan.com',
  optimism: 'https://optimistic.etherscan.io',
  klaytn: 'https://scope.klaytn.com',
  avalanche: 'https://snowtrace.io',
  gnosis: 'https://gnosisscan.io',
  aurora: 'https://explorer.mainnet.aurora.dev',
};

export const CHAIN_VALUE_TO_GNOSIS_TX_SERVICE_URL = {
  ethereum: 'https://safe-transaction-mainnet.safe.global',
  goerli: 'https://safe-transaction-goerli.safe.global',
  polygon: 'https://safe-transaction-polygon.safe.global',
  harmony: 'https://transaction.multisig.harmony.one',
  arbitrum: 'https://safe-transaction-arbitrum.safe.global',
  bsc: 'https://safe-transaction-bsc.safe.global',
  boba: 'https://safe-transaction.mainnet.boba.network',
  optimism: 'https://safe-transaction-optimism.safe.global',
  avalanche: 'https://safe-transaction-avalanche.safe.global',
  gnosis: 'https://safe-transaction-gnosis-chain.safe.global',
  aurora: 'https://safe-transaction-aurora.safe.global',
};

export const HARMONY_MULTI_SEND_ADDR =
  '0x998739BFdAAdde7C933B942a68053933098f9EDa';
export const HARMONY_SAFE_MASTER_COPY =
  '0x69f4D1788e39c87893C980c06EdF4b7f686e2938';
export const HARMONY_SAFE_MASTER_COPY2 =
  '0xfb1bffC9d739B8D520DaF37dF666da4C687191EA';
export const HARMONY_PROXY_FACTORY =
  '0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC';

if (!import.meta.env.PRODUCTION) {
  SUPPORTED_CHAINS[5] = 'goerli';
}

export const SUPPORTED_CHAIN_IDS = Object.keys(SUPPORTED_CHAINS).map(
  (chainId) => parseInt(chainId, 10)
);

export const DEFAULT_ERC20_GAS_LIMIT = '0x3D090'; // TODO hackey == 250000

export const CHAIN_LOGO = {
  '1': <Ethereum />,
  '4': <Ethereum />,
  '10': <Optimism />,
  '56': <Binance />,
  '137': <Matic />,
  '288': <Boba />,
  '8217': <Klaytn />,
  '42161': <Arbitrum />,
  '43114': <Avalanche />,
  '1666600000': <Harmony />,
  '100': <GnosisChain />,
  '1313161554': <Aurora />,
};

export const CURRENCY_SYMBOL = {
  ETH: <Ethereum />,
  WONDER: <WonderCoin />,
  MATIC: <Matic />,
  USDC: <USDCoin />,
  ONE: <Harmony />,
  AETH: <Arbitrum />,
  BNB: <Binance />,
  OP: <Optimism />,
  AVAX: <Avalanche />,
  AURORA: <Aurora />,
};

const CHAIN_SELECT_OPTIONS = [
  { label: 'Ethereum', value: 'ethereum', icon: <Ethereum /> },
  { label: 'Polygon', value: 'polygon', icon: <Matic /> },
  { label: 'Optimism', value: 'optimism', icon: <Optimism /> },
  { label: 'Arbitrum', value: 'arbitrum', icon: <Arbitrum /> },
  { label: 'BNB', value: 'bsc', icon: <Binance /> },
  { label: 'Klaytn', value: 'klaytn', icon: <Klaytn /> },
  { label: 'Gnosis', value: 'gnosis', icon: <GnosisChain /> },
  { label: 'Avalanche', value: 'avalanche', icon: <Avalanche /> },
  { label: 'Harmony', value: 'harmony', icon: <Harmony /> },
  { label: 'Boba', value: 'boba', icon: <Boba /> },
  { label: 'Aurora', value: 'aurora', icon: <Aurora /> },
];

if (!import.meta.env.PRODUCTION) {
  CHAIN_SELECT_OPTIONS.push({
    label: 'Goerli Testnet',
    value: 'goerli',
    icon: <Ethereum />,
  });
}

export function signedMessageIsString(
  message: string | boolean
): message is string {
  return typeof message === 'string';
}

export { SUPPORTED_CHAINS, CHAIN_SELECT_OPTIONS };