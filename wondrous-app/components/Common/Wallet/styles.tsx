import { ButtonBase, IconButton } from '@mui/material';
import styled, { css } from 'styled-components';

const filterDropShadow = css`
  filter: ${({ theme }) => `drop-shadow(0 3px 3px ${theme.palette.black101})`};
`;

const fontStyles = css`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: 500;
  font-size: 13px;
  color: ${({ theme }) => theme.palette.white};
`;

export const WalletWrapper = styled.div`
  display: flex;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.3)};
  align-items: center;
  justify-content: center;
  gap: 14px;
  cursor: pointer;
  z-index: 10;
`;

export const Button = styled(ButtonBase)`
  && {
    background: ${({ theme }) => theme.palette.grey87};
    border-radius: 150px;
    width: fit-content;
    height: 40px;
    white-space: nowrap;
    padding: 16px;
    ${fontStyles};
    ${filterDropShadow};
  }
`;

export const ChainWrapper = styled(IconButton)`
  && {
    width: 40px;
    height: 40px;
    background: ${({ theme }) => theme.palette.grey87};
    border-radius: 50%;
  }
`;

export const WonderBalance = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.palette.grey87};
  border-radius: 150px;
  cursor: pointer;
  display: flex;
  gap: 10px;
  height: 36px;
  justify-content: center;
  padding: 0 16px;
  position: relative;
  width: fit-content;
  ${fontStyles};
  ${filterDropShadow};
  .accordion-expansion-icon {
    transition: transform 0.2s ease-out;
    ${({ open }) => (open ? 'transform: rotate(180deg)' : 'transform: rotate(0deg)')}
  }
`;

export const WalletAddress = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.palette.grey87};
  border-radius: 150px;
  display: flex;
  height: 36px;
  justify-content: center;
  max-width: 400px;
  overflow-x: hidden;
  padding: 0 16px;
  text-overflow: ellipsis;
  :hover {
    background: ${({ theme }) => theme.palette.grey78};
  }
  ${fontStyles};
`;
