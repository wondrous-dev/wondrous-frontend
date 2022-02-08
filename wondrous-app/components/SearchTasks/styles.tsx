import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import AutocompleteComp from '@mui/material/Autocomplete';

import { HighlightBlue } from '../../theme/colors';

export const Autocomplete = styled(AutocompleteComp)`
  width: 100%;
`;

export const Input = styled(TextField)`
  &.MuiTextField-root {
    border-radius: 6px;
    display: flex;
    justify-content: center;
    border: 1px solid #4b4b4b;
    margin-right: 8px;
  }
  & .MuiOutlinedInput-root {
    padding: 0;
  }
  && .MuiInputBase-input {
    font-size: 14px;
    line-height: 19;
    letter-spacing: 0.01em;
    color: #c4c4c4;
    padding: 10px;
    outline: none;
  }
  & .MuiInput-underline:before {
    display: none;
  }
  & .MuiInput-underline:after {
    display: none;
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  .MuiInputAdornment-positionStart {
    margin: 0 12px;
  }
`;

export const Option = styled.li`
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 12px;
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
    margin-right: 12px;
  }
`;

export const LoadMore = styled.a`
  margin-top: 10px;
  cursor: pointer;
  color: ${HighlightBlue};
`;
