import { ICreateButtonProps } from './CreateButton';
import { IHeaderTitleProps } from './HeaderTitle';

export interface ListWrapperProps {
  backgroundImageUrl: string;
  CreateButtonProps: ICreateButtonProps;
  HeaderTitleProps: IHeaderTitleProps;
  showAllUrl: string;
  data?: object[];
  ListItemComponents: {
    LeftComponent: React.ElementType;
    RightComponent?: React.ElementType;
  };
}
