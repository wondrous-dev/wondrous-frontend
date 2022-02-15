export enum SupportedChainType {
  ETH = 'eth' // should be evm
}

export const CHAIN_TO_GNOSIS_URL_ABBR = {
  eth_mainnet: 'eth',
  rinkeby: 'rin',
  polygon_mainnet: 'matic',
};

export enum SupportedETHChainId {
    MAINNET = 1,
    ROPSTEN = 3,
    RINKEBY = 4,
    GOERLI = 5,
    KOVAN = 42,
  
    ARBITRUM_ONE = 42161,
    ARBITRUM_RINKEBY = 421611,
  
    OPTIMISM = 10,
    OPTIMISTIC_KOVAN = 69,
  
    POLYGON = 137,
    POLYGON_MUMBAI = 80001,
  }
  
  export const ETH_CHAIN_IDS_TO_NAMES = {
    [SupportedETHChainId.MAINNET]: 'mainnet',
    [SupportedETHChainId.ROPSTEN]: 'ropsten',
    [SupportedETHChainId.RINKEBY]: 'rinkeby',
    [SupportedETHChainId.GOERLI]: 'goerli',
    [SupportedETHChainId.KOVAN]: 'kovan',
    [SupportedETHChainId.POLYGON]: 'polygon',
    [SupportedETHChainId.POLYGON_MUMBAI]: 'polygon_mumbai',
    [SupportedETHChainId.ARBITRUM_ONE]: 'arbitrum',
    [SupportedETHChainId.ARBITRUM_RINKEBY]: 'arbitrum_rinkeby',
    [SupportedETHChainId.OPTIMISM]: 'optimism',
    [SupportedETHChainId.OPTIMISTIC_KOVAN]: 'optimistic_kovan',
  }
  
  export const ALL_SUPPORTED_ETH_CHAIN_IDS: SupportedETHChainId[] = Object.values(SupportedETHChainId).filter(
    (id) => typeof id === 'number'
  ) as SupportedETHChainId[]
  
  export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [SupportedETHChainId.MAINNET, SupportedETHChainId.POLYGON]
  

  export const INFURA_KEY = 'd828b09eb88d4a3fa4299e29b014bd28';

  export const INFURA_NETWORK_URLS: { [key in SupportedETHChainId]: string } = {
    [SupportedETHChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    [SupportedETHChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
    [SupportedETHChainId.ROPSTEN]: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
    [SupportedETHChainId.GOERLI]: `https://goerli.infura.io/v3/${INFURA_KEY}`,
    [SupportedETHChainId.KOVAN]: `https://kovan.infura.io/v3/${INFURA_KEY}`,
    [SupportedETHChainId.OPTIMISM]: `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`,
    [SupportedETHChainId.OPTIMISTIC_KOVAN]: `https://optimism-kovan.infura.io/v3/${INFURA_KEY}`,
    [SupportedETHChainId.ARBITRUM_ONE]: `https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`,
    [SupportedETHChainId.ARBITRUM_RINKEBY]: `https://arbitrum-rinkeby.infura.io/v3/${INFURA_KEY}`,
    [SupportedETHChainId.POLYGON]: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
    [SupportedETHChainId.POLYGON_MUMBAI]: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
  }
  