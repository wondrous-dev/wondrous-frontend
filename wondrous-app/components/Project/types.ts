import { ENTITIES_TYPES } from 'utils/constants';

import { ICreateButtonProps } from './CreateButton';
import { IHeaderTitleProps } from './HeaderTitle';
import { IListItemProps } from './ListItem';

export interface ListWrapperProps {
  backgroundImageUrl: string;
  CreateButtonProps?: ICreateButtonProps;
  HeaderTitleProps: IHeaderTitleProps;
  showAllUrl: string | { url: string; onClick: () => unknown };
  data?: Array<{
    [key: string]: any;
  }>;
  ListItemProps: Omit<IListItemProps, 'data'>;
}

export type EntitiesType = typeof ENTITIES_TYPES[keyof typeof ENTITIES_TYPES] | null;
