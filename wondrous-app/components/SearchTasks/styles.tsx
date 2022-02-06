import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import AutocompleteComp from '@mui/material/Autocomplete';

export const Autocomplete = styled(AutocompleteComp)`
  width: 100%;
`;

export const Input = styled(TextField)`
  &.MuiTextField-root {
    width: 100%;
    max-width: 100%;
    height: 40px;
    background-color: #0f0f0f;
    border-radius: 6px;
    padding: 10px;
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
    padding: 0;
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
`;
