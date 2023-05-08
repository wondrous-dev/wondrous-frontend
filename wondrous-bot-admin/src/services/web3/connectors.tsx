import { injected } from './injected';
import { walletConnect } from './walletConnect';
import { walletLink } from './walletLink';

const connectors = { injected, walletConnect, walletLink };

export type ConnectorName = keyof typeof connectors;

export default connectors;
