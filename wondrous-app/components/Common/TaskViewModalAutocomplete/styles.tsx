import { Autocomplete, Paper, TextField } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';

export const StyledAutocomplete = styled(Autocomplete)`
  .Mui-focused {
    outline: 1px solid ${palette.grey57};
  }
  .MuiAutocomplete-popupIndicator {
    transform: none;
  }
  .MuiAutocomplete-popupIndicatorOpen {
    svg {
      path {
        stroke: ${palette.highlightBlue};
      }
    }
  }
`;

export const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    background: ${palette.grey52};
    width: 100%;
    border-radius: 300px;
    padding-left: 10px;
    color: ${palette.white};
    font-size: 14px;
  }
`;

export const PaperComponent = styled(Paper)`
  border-radius: 6px;
  margin-top: 8px;
  .MuiAutocomplete-listbox {
    background: ${palette.grey95};
  }
  .MuiAutocomplete-noOptions {
    background: ${palette.grey95};
  }
`;

export const Option = styled.li`
  && {
    align-items: center;
    background: ${palette.grey95};
    cursor: pointer;
    display: flex;
    font-size: 13px;
    font-weight: 500;
    gap: 10px;
    min-height: 36px;
    padding: 6px 8px;
    width: 100%;
    &:hover {
      background: ${palette.grey78};
    }
  }
`;

export const ArrowWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: ${palette.grey920};
  transform: rotate(90deg);
  border-radius: 4px;
  padding: 4px;
  svg {
    path {
      fill: ${palette.highlightBlue};
    }
  }
`;
