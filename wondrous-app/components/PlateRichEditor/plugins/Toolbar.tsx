import React from 'react';
import { HeadingToolbar, ToolbarProps } from '@udecode/plate';
import styled from 'styled-components';

import palette from '../../../theme/palette';

const HeadingToolbarStyles = styled(HeadingToolbar)`
  padding: 4px;
  margin: 0 0 1.25rem;
  background: ${palette.grey99};
  border-bottom: none;
  min-height: unset;
  box-sizing: inherit;
  border-radius: 4px;
  z-index: 1000;
  width: 100%;
  color: ${palette.grey250};
  display: flex;
  justify-content: space-between;
`;

export const Toolbar = (props: ToolbarProps) => <HeadingToolbarStyles {...props} />;
