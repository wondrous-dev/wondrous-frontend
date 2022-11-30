import { ENTITIES_TYPES } from 'utils/constants';
import { ICreateButtonProps } from './CreateButton';
import { IHeaderTitleProps } from './HeaderTitle';

export interface ListWrapperProps {
  backgroundImageUrl: string;
  CreateButtonProps: ICreateButtonProps;
  HeaderTitleProps: IHeaderTitleProps;
  showAllUrl: string | { url: string; onClick: () => unknown };
  data?: object[];
  ListItemProps: {
    LeftComponent: React.ElementType;
    RightComponent?: React.ElementType;
    onClick?: (router, data?) => void;
  };
}

export type EntitiesType = typeof ENTITIES_TYPES[keyof typeof ENTITIES_TYPES] | null;
