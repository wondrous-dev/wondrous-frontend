import React from 'react';
import { LinkSquareIconWrapper } from './styles';
import Tooltip from 'components/Tooltip';

export const LinkSquareIcon = ({ icon, title, style = {} }) => {
  return (
    <Tooltip title={title} placement="top">
      <LinkSquareIconWrapper style={style}>{icon}</LinkSquareIconWrapper>
    </Tooltip>
  );
};
