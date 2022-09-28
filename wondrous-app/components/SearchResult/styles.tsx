import { Typography } from '@mui/material';
import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-top: 100px;
  margin-left: 20px;
  margin-right: 20px;
`;

export const Title = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 20px;
    display: flex;
    align-items: center;
    color: #ffffff;
  }
`;
