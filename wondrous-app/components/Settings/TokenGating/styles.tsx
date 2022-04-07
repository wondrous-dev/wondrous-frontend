import { Autocomplete, Box, ButtonBase, InputBase, InputLabel, Typography } from '@mui/material';
import ArrowDropDownIcon from 'components/Icons/arrowDropDown';
import styled from 'styled-components';
import { Background, Black92, Blue20, Grey250, Grey85, White } from 'theme/colors';

export const TokenGatingHeaderText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 28px;
    font-weight: 500;
    color: ${White};
  }
`;

export const TokenGatingHeaderTextSecondary = styled(Typography)`
  && {
    color: ${Grey250};
  }
`;

export const TokenGatingSubheading = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 400;
    color: ${Grey250};
    margin-top: 12px;
  }
`;

export const TokenGatingFormWrapper = styled(Box)`
  background: #1b1b1b;
  width: 558px;
  border-radius: 6px;
  padding: 24px;
  margin-top: 48px;
`;

export const TokenGatingFormHeader = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 18px;
    font-weight: 700;
    color: ${White};
  }
`;

export const TokenGatingFormHeaderSecondary = styled(Typography)`
  && {
    color: #c2b2f3;
  }
`;

export const TokenGatingAutocompleteLabel = styled(InputLabel)`
  font-family: 'Space Grotesk';
  font-size: 14px;
  font-weight: 500;
  color: ${Blue20};
  margin-left: 8px;
  margin-top: 28px;
`;

export const TokenGatingAutocomplete = styled(Autocomplete)`
  margin-top: 12px;
`;

export const TokenGatingAutocompleteTextfieldWrapper = styled(Box)`
  && {
    display: flex;
    align-items: center;
  }
`;

export const TokenGatingAutocompleteTextfieldInput = styled(InputBase)`
  && {
    background: ${Background};
    border-radius: 6px;
    border: 1px solid ${Grey85};
    display: flex;
    color: ${Grey250};
    height: inherit;
    font-size: 15px;
    height: 40px;
  }

  .MuiInputBase-input {
    padding: 0;
    padding-left: 8px;
  }
`;

export const TokenGatingAutocompleteTextfieldButton = styled(ButtonBase)`
  && {
    background: ${Black92};
    height: 100%;
    width: 34px;
    margin-top: 0px;
    border-radius: 0 5px 5px 0;
    border-left: 1px solid ${Grey85};
  }
`;

export const TokenGatingAutocompleteTextfieldIcon = styled(ArrowDropDownIcon)``;
