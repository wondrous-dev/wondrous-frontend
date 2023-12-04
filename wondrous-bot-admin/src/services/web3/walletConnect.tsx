/*
DEPRECATED
*/
import { RPC_URLS, SUPPORTED_CHAIN_IDS } from 'utils/web3Constants';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const walletConnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  supportedChainIds: SUPPORTED_CHAIN_IDS,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
});
