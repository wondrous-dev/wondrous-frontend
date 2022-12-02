import { NextRouter } from 'next/router';
import React from 'react';
import { ENTITIES_TYPES } from 'utils/constants';

export interface IListItemProps {
  LeftComponent: React.ElementType;
  RightComponent?: React.ElementType;
  data?: object;
  onClick?: (router: NextRouter, data?) => void;
}

export interface IHeaderTitleProps {
  text: string;
  IconComponent: React.ElementType;
}

export interface ICreateButtonProps {
  onClick: () => unknown;
  text: string;
}

export interface ListWrapperProps {
  backgroundImageUrl: string;
  CreateButtonProps?: ICreateButtonProps;
  HeaderTitleProps: IHeaderTitleProps;
  showAllUrl: string;
  data?: Array<{
    [key: string]: any;
  }>;
  ListItemProps: Omit<IListItemProps, 'data'>;
}

export type EntitiesType = typeof ENTITIES_TYPES[keyof typeof ENTITIES_TYPES] | null;
