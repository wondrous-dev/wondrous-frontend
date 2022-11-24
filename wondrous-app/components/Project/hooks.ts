import { useProject } from 'utils/hooks';
import { EntitiesType } from './types';
import { ICreateButtonProps } from './CreateButton';

export const useEntityCreateButtonProps = (entityType: EntitiesType): ICreateButtonProps => {
  const { setEntityType } = useProject();
  return {
    onClick: () => setEntityType(entityType),
    text: entityType,
  };
};
