import { RPC_URLS } from 'utils/web3Constants';

import CustomAbstractConnector from './CustomAbstractConnector';

export const walletLink = new CustomAbstractConnector({
  url: RPC_URLS[1],
  appName: 'Wonder',
  darkMode: true,
});
