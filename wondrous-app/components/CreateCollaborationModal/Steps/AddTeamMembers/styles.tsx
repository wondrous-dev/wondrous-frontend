import styled from 'styled-components';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';
import palette from 'theme/palette';
import typography from 'theme/typography';
import MuiGrid from '@mui/material/Grid';
import MuiTextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export const TextField = styled(MuiTextField)`
  && {
    .MuiOutlinedInput-root {
      padding-left: 14px;
      padding-right: 14px !important;
    }
  }
`;

export const Grid = styled(MuiGrid)`
  && {
    .MuiSelectUnstyled-root {
      background: ${palette.black97};
    }
  }
`;

export const ListboxWrapper = styled.ul`
  border-color: #7a7a7a;
  scroll-padding-right: 0;
  max-height: 200px;
  ${ScrollBarStyles};
  li {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 100%;
    background: ${palette.grey95};
    min-height: 36px;
    padding: 6px 12px;
    &:hover {
      background: ${palette.grey87};
    }
  }
`;

export const PaperComponent = styled.div`
  .MuiAutocomplete-noOptions {
    background: #1f1f1f;
    font-family: ${typography.fontFamily};
    font-size: 14px;
    color: ${palette.white};
    font-weight: 500;
    border-color: #7a7a7a;
  }
`;

export const InviteAllButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 11px;
  padding: 10px 12px;
  border-radius: 6px;
  color: white;
  height: fit-content;
  cursor: pointer;
  min-width: 20%;
  background: #4000b3;
  border: 1px solid #7427ff;
  &:hover {
    background: #7427ff;
  }
`;

export const SelectedUsersWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 10px;
  margin: 0;
  margin-top: 10px;
`;

export const SelectedUserItem = styled.li`
  color: ${palette.white};
  display: flex;
  width: 100%;
  gap: 10px;
  align-items: center;
  font-family: ${typography.fontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
`;

export const CloseIconWrapper = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: flex-end;
  svg {
    cursor: pointer;
  }
`;

export const SelectedCount = styled(Typography)`
  && {
    color: ${palette.grey57};
    font-weight: 400;
    font-size: 13px;
    margin-top: 10px;
  }
`;
