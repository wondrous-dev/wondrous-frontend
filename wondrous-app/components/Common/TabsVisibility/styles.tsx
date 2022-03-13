import { Button } from '@mui/material';
import styled from 'styled-components';

export const TabsVisibilityWrapper = styled.div`
  border-radius: 6px;
  background: #161616;
  padding: 5px;
`;

export const TabsVisibilityButton = styled(Button)`
  && {
    font-family: 'Space Grotesk';
    font-size: 15px;
    font-style: normal;
    font-weight: ${({ isSelected }) => (isSelected ? 500 : 400)};
    color: ${({ isSelected }) => (isSelected ? '#CCBBFF' : '#7a7a7a')};
    width: 270px;
    height: 30px;
    background: ${({ isSelected }) => (isSelected ? '#232323' : '#161616')};
    border-radius: 4px;
    :hover {
      background: ${({ isSelected }) => (isSelected ? '#232323' : '#161616')};
    }
  }
`;
