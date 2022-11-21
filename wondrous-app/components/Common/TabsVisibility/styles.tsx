import { Button } from '@mui/material';
import styled from 'styled-components';

export const TabsVisibilityWrapper = styled.div`
  border-radius: 6px;
  background: ${({ variant }) => (variant ? '#0F0F0F' : '#161616')};
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  & > * {
    margin-left: 5px;
    :first-child {
      margin-left: 0;
    }
  }
`;

export const TabsVisibilityButton = styled(Button)`
  && {
    text-transform: capitalize;
    font-family: var(--font-space-grotesk);
    font-size: 15px;
    font-style: normal;
    font-weight: ${({ isSelected }) => (isSelected ? 500 : 400)};
    color: ${({ isSelected }) => (isSelected ? '#CCBBFF' : '#7a7a7a')};
    width: 100%;
    height: 30px;
    background: ${({ isSelected, variant }) => (isSelected ? '#232323' : variant ? '#161616' : 'transparent')};
    border-radius: 4px;
    :hover {
      background: ${({ isSelected }) => (isSelected ? '#232323' : '#161616')};
    }
  }
`;
