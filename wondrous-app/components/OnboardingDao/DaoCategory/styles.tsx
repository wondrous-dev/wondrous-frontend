import { Chip } from '@mui/material';
import styled from 'styled-components';

export const ChipWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
`;

export const Divider = styled.div`
  height: 1px;
  border-bottom: 1px dashed ${({ theme }) => theme.palette.grey75};
`;

export const StyledChip = styled(Chip)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 26px;
    background: ${({ selected }) => (selected ? `#4f00de` : `#141414`)};
    border-radius: 4px;
    :hover {
      background: #4f00de;
      cursor: pointer;
    }
    .MuiChip-label {
      padding: 0;
      padding: 4px 9px;
      font-family: 'Space Grotesk';
      font-weight: 500;
      font-size: 15px;
      color: ${({ theme }) => theme.palette.white};
    }
  }
`;
