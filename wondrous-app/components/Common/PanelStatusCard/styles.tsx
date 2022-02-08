import React from 'react';
import { Box, Typography } from '@material-ui/core';
import styled from 'styled-components';

export const Background = styled(Box)`
  background: #0f0f0f;
  width: 241px;
  height: 107px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 14px;
`;

export const CountIconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CountComponent = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 32px;
    font-weight: 600;
    background: ${(props) => props.color};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const Count = React.memo(CountComponent);

export const Status = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    color: #c4c4c4;
  }
`;
