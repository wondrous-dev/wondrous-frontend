export enum SupportedChainType {
  ETH = 'eth', // should be evm
}
export const CHAIN_ID_TO_CHAIN_NAME = {
  1: 'ethereum',
  5: 'goerli',
  137: 'polygon',
  1666600000: 'harmony',
  42161: 'arbitrum',
  56: 'bsc',
  288: 'boba',
  10: 'optimism',
  8217: 'klaytn',
  43114: 'avalanche',
};

export const CHAIN_TO_GNOSIS_URL_ABBR = {
  ethereum: 'eth',
  goerli: 'gor',
  polygon: 'matic',
  bsc: 'bnb',
  arbitrum: 'arb1',
  optimism: 'opt',
  avalanche: 'avax', // TODO check thisis right
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
};
