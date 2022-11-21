import { Box, Popper, Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';
import { LockIconOutline } from '../../Icons/userpass';

export const PrivateBoardIconBackground = styled.div`
  background: linear-gradient(196.76deg, ${palette.black90} -48.71%, ${palette.black97} 90.48%);
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  margin-right: 10px;
  height: 40px;
`;

export const PrivateBoardIconPopper = styled(Popper)`
  && {
    position: absolute;
    z-index: 10000;
  }
`;

export const PrivateBoardIconPopperWrapper = styled(Box)`
  width: auto;
  padding-left: 4px;
  padding-right: 4px;
  height: 28px;
  border-radius: 4px;
  background: #363636;
  display: flex;
  justify-content: center;
  align-items: center;
  ::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 30px;
    width: 16px;
    height: 16px;
    background: #363636;
    border-radius: 2px;
    transform: rotate(45deg);
  }
`;

export const PrivateBoardIconPopperText = styled(Typography)`
  && {
    color: #c4c4c4;
    font-size: 12px;
    font-family: var(--font-space-grotesk);
    font-style: normal;
    font-weight: 500;
    z-index: 1;
  }
`;
