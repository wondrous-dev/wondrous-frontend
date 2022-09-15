import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import AutocompleteComp from '@mui/material/Autocomplete';

import palette from 'theme/palette';
import SearchIcon from 'components/Icons/search';

export const SearchIconWrapped = styled(SearchIcon)`
  path {
    stroke: ${palette.blue20};
  }
`;

export const Autocomplete = styled(AutocompleteComp)`
  width: 100%;
  transition: width 0.3s;
  && .MuiAutocomplete-inputRoot {
    position: relative;
    padding: 0;
    font-family: Space Grotesk;
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 5px;
      background: ${({ isExpanded }) => (isExpanded ? 'linear-gradient(90deg, #ccbbff 1.14%, #7427ff 100.09%)' : '')};
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 1px;
    }
    &:hover {
      &::after {
        background: linear-gradient(264.14deg, #7427ff 3.71%, #363636 92.81%);
        cursor: pointer;
      }
    }
    &:hover ${SearchIconWrapped} {
      path {
        stroke: url(#linear);
      }
    }
  }
`;

export const Input = styled(TextField)`
  && {
    &.MuiTextField-root {
      border-radius: 6px;
      display: flex;
      justify-content: center;
      margin-right: 8px;
      padding: 0;
      background: #1b1b1b;
      position: relative;
    }
    & .MuiOutlinedInput-root {
      padding: 0;
    }
    && .MuiInputBase-input {
      font-size: 14px;
      line-height: 19;
      letter-spacing: 0.01em;
      color: #c4c4c4;
      padding: 10px 0px 10px 0px;
      outline: none;
      ::placeholder {
        color: white;
        opacity: 1;
      }
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

  img {
    margin-right: 12px;
  }
`;

export const LoadMore = styled.a`
  margin-top: 10px;
  cursor: pointer;
  color: ${palette.highlightBlue};
`;
