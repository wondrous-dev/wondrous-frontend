import { InjectedConnector } from '@web3-react/injected-connector';
import { SUPPORTED_CHAIN_IDS } from 'utils/constants';

export const injected = new InjectedConnector({
  // supportedChainIds: SUPPORTED_CHAIN_IDS,
});

export const authorizationMethods = {
  isAuthorized: injected.isAuthorized,
  getAuthorizedAccount: async () => injected.getAccount(),
};
