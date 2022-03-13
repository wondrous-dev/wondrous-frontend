import { AbstractConnector } from '@web3-react/abstract-connector';
import { authorizationMethods as injectedAuth, injected } from './implementations/injected';
import { authorizationMethods as walletConnectAuth, walletConnect } from './implementations/walletConnect';
import { ConnectorAuthMethods } from './types';

const connectorsWithAuth: {
  [connectorName: string]: { connector: AbstractConnector; authorizationMethods: ConnectorAuthMethods };
} = {
  injected: {
    connector: injected,
    authorizationMethods: injectedAuth,
  },
  walletConnect: {
    connector: walletConnect,
    authorizationMethods: walletConnectAuth,
  },
};

export default connectorsWithAuth;
