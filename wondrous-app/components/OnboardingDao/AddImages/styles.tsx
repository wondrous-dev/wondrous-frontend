import { Typography } from '@mui/material';
import styled from 'styled-components';

export const LogoWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.palette.grey85};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AddPhotoIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: #2c2c2c;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderWrapper = styled.div`
  background: ${({ theme }) => theme.palette.grey85};
  border-radius: 6px;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    color: ${({ theme }) => theme.palette.grey250};
  }
`;
