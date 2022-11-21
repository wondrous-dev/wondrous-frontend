import React from 'react';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

export const StyledBorder = styled(Box)`
  padding: 1px;
  background: #0f0f0f;
  border-radius: 3px;
  ${({ isAdmin }) =>
    isAdmin &&
    `
      &:hover {
        cursor: pointer;
      } ;
  `}
  ${({ isActive, color, isAdmin }) =>
    isActive &&
    isAdmin &&
    `
      background: ${color} ;
  `}
`;

export const StyledBackground = styled(Box)`
  background: #0f0f0f;
  width: 241px;
  height: 107px;
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 14px;
`;

export const CountIconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Count = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-size: 32px;
    font-weight: 600;
    background: ${(props) => props.color};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const Status = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    color: #c4c4c4;
  }
`;
