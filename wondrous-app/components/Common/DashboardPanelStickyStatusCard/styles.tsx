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
  min-width: 250px;
  display: flex;
  border-radius: 3px;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
`;

export const CountStatusWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Count = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
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
    margin: 0 24px 0 8px;
  }
`;
