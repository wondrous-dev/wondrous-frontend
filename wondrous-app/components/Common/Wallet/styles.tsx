import { IconButton } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';

export const WalletWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  margin-right: 20px;
`;

export const ChainWrapper = styled(IconButton)`
  && {
    width: 40px;
    height: 40px;
    background: #1e1e1e;
    border-radius: 4px;
    margin-right: 20px;
  }
`;

export const WalletConnectButton = styled(IconButton)`
  && {
    width: 200px;
    height: 40px;
    background: #1e1e1e;
    border-radius: 4px;
    margin-right: 20px;
  }
`;

export const WalletDisplay = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: auto;
  height: 40px;

  border-radius: 3px;

  padding: 0 4px;

  background: ${palette.black95};
`;

export const WonderBalance = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  cursor: pointer;
  border: 1px solid #4b4b4b;
  border-radius: 6px;
  position: relative;
  gap: 10px;
  margin-right: 10px;
  .accordion-expansion-icon {
    transition: transform 0.2s ease-out;
    ${({ isExpanded }) => (isExpanded ? 'transform: rotate(180deg)' : 'transform: rotate(0deg)')}
  }
  &:hover {
    .accordion-expansion-icon path {
      fill: rgba(116, 39, 255, 1);
    }
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 6px;
      background: linear-gradient(264.14deg, #7427ff 3.71%, #363636 92.81%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 1px;
    }
  }
`;

export const WalletAddress = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  max-width: 400px;
  height: 32px;

  border-radius: 3px;

  background: ${palette.background.default};

  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  padding-left: 8px;
  padding-right: 8px;
  overflow-x: hidden;
`;

export const CurrencySelectorItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 15rem;
  cursor: pointer;
  padding-left: 10px;
  position: relative;
  border-radius: 4px;
  background: ${({ selected }) => (selected ? `#121212` : 'transparent')};
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 4px;
    background: ${({ selected }) => selected && 'linear-gradient(270deg, #7427ff -11.62%, #ccbbff 103.12%)'};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
  }
  &:hover {
    background: #121212;
  }
`;

export const CurrencySymbol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 32px;
`;

export const CurrencyName = styled.div`
  display: flex;
  flex-grow: 1;
  flext-direction: column;
  align-items: center;
`;

export const DropdownItem = styled.div`
  padding: 5px;
`;

export const CurrencyWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
