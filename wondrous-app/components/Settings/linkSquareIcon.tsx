import React from 'react';
import Tooltip from 'components/Tooltip';
import { LinkSquareIconWrapper } from './styles';

export function LinkSquareIcon({ icon, title }) {
  return (
    <Tooltip title={title} placement="top">
      <LinkSquareIconWrapper>{icon}</LinkSquareIconWrapper>
    </Tooltip>
  );
}
