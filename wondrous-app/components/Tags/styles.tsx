import React from 'react';
import styled from 'styled-components';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { White } from '../../theme/colors';

export const StyledAutocomplete = styled(Autocomplete).attrs((props) => ({
  className: 'MuiAutocomplete-root',
}))`
  display: flex;
  align-items: center;
  background: #0f0f0f;
  border-radius: 6px;
  min-height: 40px;
  color: ${White};

  input {
    color: #c4c4c4;
    top: -10px;
    left: 8px;
    font-size: 14px;
    height: 30px;

    &::placeholder {
      color: #c4c4c4;
      opacity: 1;
    }
  }

  svg {
    color: #c4c4c4;
  }

  .MuiAutocomplete-popper {
    background: #0f0f0f;
  }

  .MuiAutocomplete-endAdornment {
    top: auto;
  }
`;

export const AutocompleteList = styled(Popper).attrs((props) => ({
  className: `${autocompleteClasses.listbox}`,
}))`
  .MuiPaper-root {
    background: #0f0f0f !important;
    top: auto;
    bottom: auto;
  }

  li {
    font-family: Space Grotesk;
    font-size: 14px;
    color: ${White};
    display: flex;
    align-items: center;
  }

  .MuiAutocomplete-noOptions {
    font-family: Space Grotesk;
    font-size: 14px;
    color: ${White};
  }
`;

export const StyledAutocompletePopper = styled(({ className, ...props }) => {
  return <StyledAutocomplete {...props} classes={{ paper: className }} />;
})`
  && {
    background: #0f0f0f;
  }

  & .MuiAutocomplete-noOptions {
    font-family: 'Space Grotesk';
    color: ${White};
    font-size: 14px;
  }
`;

export const OptionDiv = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 8px;
`;

export const OptionTypography = styled(Typography)`
  && {
    font-family: Space Grotesk;
    font-size: 14px;
    color: ${White};
    margin-left: 8px;
  }
`;

export const StyledChip = styled(Chip)`
  && {
    margin: 3px 5px 3px 0;
    color: #c4c4c4;
    background: #0f0f0f;
    border: 1px solid rgb(116, 39, 255);
  }
`;

export const StyledChipTag = styled(Chip)`
  && {
    //margin: 3px 5px 3px 0;
    color: #c4c4c4;
    background: #424141;
    border: 0;
    border-radius: 6px;
    height: 25px;
    margin-right: 6px;
  }

  .MuiChip-label {
    color: #ffffff;
    font-size: 15px;
    padding: 0 10px;
  }

  .MuiChip-icon {
    color: #ffffff;
    font-weight: bold;
  }
`;
