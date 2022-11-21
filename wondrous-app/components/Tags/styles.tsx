import React from 'react';
import styled from 'styled-components';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

import palette from 'theme/palette';
import { InputAdornment, TextField } from '@mui/material';

export const StyledAutocomplete = styled(Autocomplete).attrs(() => ({
  className: 'MuiAutocomplete-root',
}))`
  display: flex;
  align-items: center;
  background: #141414;
  border-radius: 6px;
  min-height: 32px;
  color: ${palette.white};
`;

export const TagAutocompletePopper = styled(({ className, ...props }) => (
  <StyledAutocomplete {...props} classes={{ paper: className }} />
))`
  .MuiAutocomplete-listbox {
    border-color: #7a7a7a;
    max-height: 200px;
  }
  .MuiAutocomplete-noOptions {
    background: #1f1f1f !important;
    font-family: var(--font-space-grotesk);
    font-size: 14px;
    color: ${palette.white};
    font-weight: 500;
    border-color: #7a7a7a;
  }
`;

export const OptionItem = styled.li`
  && {
    height: 36px;
    background: #1f1f1f;
    font-family: var(--font-space-grotesk);
    font-size: 14px;
    padding: 12px;
    font-weight: 500;
  }

  /* &:before {
    content: '';
    position: absolute;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${(props) => props.color || 'transparent'};
  } */
`;

export const StyledChipTag = styled(Chip)`
  &&& {
    background: #4000b5;
    border: 0;
    border-radius: 4px;
    height: 20px;
    display: flex;
    align-items: center;

    > span {
      color: #ffffff;
      font-weight: 500;
      font-size: 13px;
      font-family: var(--font-space-grotesk);
    }

    &:hover {
      opacity: 0.8;
      background: #4000b5;
    }

    .MuiChip-deleteIcon {
      color: #ffffff;
      font-size: 13px;
      font-weight: 400;
      :hover {
        color: #ffffff;
      }
    }
  }

  .MuiChip-label {
    color: #ffffff;
    font-size: 15px;
    padding: 0 10px;
  }
`;

export const TagsTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      padding: 6px;
      color: ${palette.white};
      font-family: var(--font-space-grotesk);
      font-size: 13px;
      font-weight: 500;
      color: #c4c4c4;
      background: inherit;
      gap: 6px;

      .MuiOutlinedInput-notchedOutline {
        border: none;
      }
      .MuiOutlinedInput-input {
        min-width: 100px;
        padding: 0;
        margin: 0;

        display: ${({ disabled }) => disabled && `none`};
      }
    }
    .MuiAutocomplete-hasPopupIcon {
      padding: 0;
    }
  }
`;

export const TagsChipWrapper = styled.div`
  display: ${(props) => (props.children ? 'flex' : 'none')};
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const TagsInputAdornment = styled(InputAdornment)``;
