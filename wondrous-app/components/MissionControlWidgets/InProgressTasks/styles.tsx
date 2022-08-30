import styled from 'styled-components';
import typography from 'theme/typography';
import palette from 'theme/palette';
import Typography from '@mui/material/Typography';
import MuiAutocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';

export const TaskContainer = styled.div`
  background: ${palette.grey950};
  border-radius: 6px;
  padding: 12px;
  display: flex;
  gap: 10px;
  cursor: pointer;
  align-items: center;
  &:hover {
    background: ${palette.grey87};
  }
`;

export const TasksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TaskTitle = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: ${palette.white};
  }
`;

export const Autocomplete = styled(MuiAutocomplete)`
  flex: 1;
  .MuiAutocomplete-clearIndicator {
    color: ${palette.white};
  }
  .MuiAutocomplete-popupIndicator {
    color: ${palette.white};
  }
`;

export const Input = styled(TextField)`
  && {
    padding: 8px;
    border-radius: 6px;
    background: ${palette.grey87};
    .MuiOutlinedInput-input {
      font-family: ${typography.fontFamily};
      font-weight: 600;
      font-size: 14px;
      line-height: 17px;
      color: ${palette.white};
    }
  }
`;

export const SearchIconContainer = styled.div`
  background: ${palette.grey87};
  padding: 8px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    path {
      stroke: ${palette.blue20};
    }
  }
`;

export const OrgSearchWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  .MuiAutocomplete-popper {
    flex: 1;
    flex-basis: 100%;
    border: 1px solid ${palette.grey70};
    border-radius: 4px;
    overflow: hidden;
    .MuiAutocomplete-listbox {
      display: flex;
      flex-direction: column;
      gap: 12px;
      .MuiAutocomplete-option {
        padding: 10px;
        border-radius: 0;
        &:hover {
          background: ${palette.grey87};
        }
      }
    }
  }
`;

export const EmptyStateText = styled(Typography)`
  && {
    color: ${palette.white};
    font-family: ${typography.fontFamily};
    font-size: 13px;
  }
`;

export const TasksContainer = styled.div`
  max-height: 200px;
  overflow: auto;
  ${ScrollBarStyles};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
