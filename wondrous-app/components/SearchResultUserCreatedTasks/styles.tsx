import { Typography } from '@mui/material';
import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-top: 100px;
  margin-left: 20px;
  margin-right: 20px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid #232323;
  padding-bottom: 8px;
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

export const TotalTaskCount = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: #c4c4c4;
  }
`;
