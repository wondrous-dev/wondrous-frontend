import { SUPPORTED_CHAIN_IDS } from '@utils/constants';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.NEXT_PUBLIC_RPC_URL_ETH,
  137: process.env.NEXT_PUBLIC_RPC_URL_MATIC,
};

export const walletConnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  supportedChainIds: SUPPORTED_CHAIN_IDS,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
});

export const authorizationMethods = {
  isAuthorized: async () => {
    const stored = localStorage.getItem('walletconnect');
    if (!stored) return false;
    try {
      const { connected } = JSON.parse(stored);
      return connected;
    } catch {
      return false;
    }
  },
  getAuthorizedAccount: async () => {
    const stored = localStorage.getItem('walletconnect');
    if (!stored) return null;
    try {
      const { accounts } = JSON.parse(stored);
      return accounts[0];
    } catch {
      return null;
    }
  },
};
