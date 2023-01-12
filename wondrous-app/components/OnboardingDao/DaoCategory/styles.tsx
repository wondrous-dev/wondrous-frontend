import { FormControlLabel, RadioGroup } from '@mui/material';
import styled from 'styled-components';

export const CategoriesWrapper = styled(RadioGroup)`
  && {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 14px;
  }
`;


export const Label = styled(FormControlLabel)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 26px;
    background: ${({ checked, theme }) => (checked ? theme.palette.violet100 : theme.palette.midnight)};
    border-radius: 4px;
    :hover {
      background: ${({ theme }) => theme.palette.violet100};
      cursor: pointer;
    }
    .MuiRadio-root {
      display: none;
    }
    .MuiTypography-root {
      padding: 0;
      padding: 4px 9px;
      font-family: ${({ theme }) => theme.typography.fontFamily};
      font-weight: 500;
      font-size: 15px;
      color: ${({ theme }) => theme.palette.white};
    }
  }
`;
