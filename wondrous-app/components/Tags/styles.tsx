import React from 'react';
import styled from 'styled-components';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

import { White } from '../../theme/colors';
import {getContrastYIQ} from "utils/colors";

export const StyledAutocomplete = styled(Autocomplete).attrs(() => ({
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

  .MuiAutocomplete-inputRoot {
    padding: 0 40px;
  }

  .MuiAutocomplete-popper {
    background: #0f0f0f;
  }

  .MuiAutocomplete-endAdornment {
    top: auto;
  }
`;

export const OptionItem = styled.li`
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.color || 'transparent'};
  }
`;


export const StyledChipTag = styled(Chip)`
  && {
    color: ${props => getContrastYIQ(props.bgColor)};
    background: ${props => props.bgColor};
    border: 0;
    border-radius: 6px;
    height: 25px;
    margin-right: 6px;
    
    > span {
      color: ${props => getContrastYIQ(props.bgColor)};
    }
    
    &:hover {
      background: ${props => props.bgColor};
      opacity: 0.9;
    }
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

export const LeftInputAdornment = styled.div`
  left: 16px;
  position: absolute;
  display: flex;
`;

export const RightInputAdornment = styled.div`
  right: 16px;
  position: absolute;
  display: flex;
`;
