import { FormControlLabel, RadioGroup } from '@mui/material';
import styled from 'styled-components';

export const CategoriesWrapper = styled(RadioGroup)`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 14px;
`;

export const Divider = styled.div`
  height: 1px;
  border-bottom: 1px dashed ${({ theme }) => theme.palette.grey75};
`;

export const Label = styled(FormControlLabel)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 26px;
    background: ${({ checked }) => (checked ? `#4f00de` : `#141414`)};
    border-radius: 4px;
    :hover {
      background: #4f00de;
      cursor: pointer;
    }
    .MuiRadio-root {
      display: none;
    }
    .MuiTypography-root {
      padding: 0;
      padding: 4px 9px;
      font-family: 'Space Grotesk';
      font-weight: 500;
      font-size: 15px;
      color: ${({ theme }) => theme.palette.white};
    }
  }
`;
