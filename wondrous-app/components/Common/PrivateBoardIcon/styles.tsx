import { Box, Popper, Typography } from '@mui/material';
import styled from 'styled-components';
import { Black90, Black97 } from '../../../theme/colors';
import { LockIconOutline, EyeIcon } from '../../Icons/userpass';

export const PrivateBoardIconBackground = styled.div`
  background: linear-gradient(196.76deg, ${Black90} -48.71%, ${Black97} 90.48%);
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  margin-right: 10px;
  height: 40px;
  ${({ isPrivate }) => !isPrivate && `display: none;`}
  ${({ isClickable }) => isClickable && `cursor:pointer`}
`;

export const PrivateBoardIconLockIcon = styled(() => <LockIconOutline color="#CCBBFF" viewBox="-6 -4 24 24" />)``;

export const PrivateBoardIconPopper = styled(Popper)``;

export const PrivateBoardIconPopperWrapper = styled(Box)`
  width: 78px;
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
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 500;
    z-index: 1;
  }
`;
