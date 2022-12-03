import { useMemo } from 'react';
import CreateEntityComponent from './CreateEntityComponent';

export enum TYPES {
  CREATE_ENTITY = 'CREATE_ENTITY',
}

const TYPES_PER_COMPONENT = {
  [TYPES.CREATE_ENTITY]: CreateEntityComponent,
};

const HeaderItems = ({ type, onClose }) => {
  const Component = useMemo(() => TYPES_PER_COMPONENT[type], [type]);

  return <Component onClose={onClose} />;
};

export default HeaderItems;
