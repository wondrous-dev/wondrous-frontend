import isServerSide from '@utils/isServerSide';
import { ConnectorName } from '../connectors';

const STORAGE_KEY = 'stored_connector';

export default function useStoredConnector(): {
  storedConnector: ConnectorName | undefined;
  setStoredConnector: (connector: ConnectorName) => void;
} {
  const setStoredConnector = (connectorName: ConnectorName) => {
    localStorage.setItem(STORAGE_KEY, connectorName);
  };

  let storedConnector;
  if (!isServerSide()) {
    storedConnector = localStorage.getItem(STORAGE_KEY) as ConnectorName;
  }

  return { storedConnector, setStoredConnector };
}
