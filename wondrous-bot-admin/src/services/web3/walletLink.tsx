import { RPC_URLS } from 'utils/web3Constants';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

export const walletLink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: 'Wonder',
  darkMode: true,
});
