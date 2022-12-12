import { useMemo } from 'react';
import CreateEntityComponent from './CreateEntityComponent';
import UserProfile from './UserProfile';
import WalletItem from './Wallet';

export enum TYPES {
  CREATE_ENTITY = 'CREATE_ENTITY',
  WALLET = 'WALLET',
  NOTIFICATIONS = 'NOTIFICATIONS',
  PROFILE = 'PROFILE'
}

const TYPES_PER_COMPONENT = {
  [TYPES.CREATE_ENTITY]: CreateEntityComponent,
  [TYPES.PROFILE]: UserProfile,
  [TYPES.WALLET]: WalletItem,
};

const HeaderItems = ({ type, onClose }) => {
  const Component = useMemo(() => TYPES_PER_COMPONENT[type], [type]);

  return <Component onClose={onClose} />;
};

export default HeaderItems;
