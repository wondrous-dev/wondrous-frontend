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
};

export const CHAIN_TO_GNOSIS_URL_ABBR = {
  ethereum: 'eth',
  goerli: 'gor',
  polygon: 'matic',
  bsc: 'bnb',
  arbitrum: 'arb1',
  optimism: 'opt',
};

export const LIT_PROTOCOL_MESSAGE = 'signature verification to token gating';
