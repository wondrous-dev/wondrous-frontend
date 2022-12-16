import { ButtonBase } from '@mui/material';
import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 24px 14px;
  justify-content: ${({ minimized }) => (minimized ? 'center' : 'flex-end')};
`;

export const Button = styled(ButtonBase)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    background: transparent;
    border-radius: 50%;
    background: ${({ theme }) => theme.palette.black97};
    ${({ minimized }) =>
      minimized &&
      `
    
    transition: transform 0.2s;
    transform: rotate(180deg);
    `}
  }
`;
