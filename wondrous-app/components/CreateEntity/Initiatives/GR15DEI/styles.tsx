import { Typography } from '@mui/material';
import styled, { css } from 'styled-components';
import { white } from 'theme/colors';

export const GRDEISelectorContainer = styled.div`
  font-family: 'Space Grotesk';
  font-weight: 500;
  font-size: 13px;
  min-width: 130px;
  max-width: 250px;
  border-radius: 4px;
  background: #262626;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  margin-left: 20px;
  height: 45.5px;
  padding-right: 12px;
`;

export const GR15DEISelectorText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    color: ${white};
    margin-right: 4px;
  }
`;
