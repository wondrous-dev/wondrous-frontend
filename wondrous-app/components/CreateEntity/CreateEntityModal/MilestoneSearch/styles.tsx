import { ButtonUnstyled, PopperUnstyled } from '@mui/base';
import { Autocomplete, ClickAwayListener, InputAdornment, TextField, Typography } from '@mui/material';
import CloseModalIcon from 'components/Icons/closeModal';
import MilestoneIcon from 'components/Icons/milestoneField.svg';
import SearchIcon from 'components/Icons/search';
import styled, { css } from 'styled-components';
import palette from 'theme/palette';
import CheckBox from '../../../Icons/checkBox.svg';
import CheckBoxEmpty from '../../../Icons/checkBoxEmpty.svg';
import MilestoneCreateIcon from '../../../Icons/milestoneNew.svg';

export const scrollBarStyles = css`
  :hover {
    &::-webkit-scrollbar {
      display: block;
    }
  }
  &::-webkit-scrollbar {
    display: none;
    position: absolute;
    z-index: 999;
    width: 20px;
    background: transparent;
    border-radius: 0 4px 4px 0;
    outline: none;
  }
  &::-webkit-scrollbar-track {
    background: #606060;
    background-clip: padding-box;
    border: 8px solid rgba(0, 0, 0, 0);
    border-radius: 50px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    border: 8px solid rgba(0, 0, 0, 0);
    background: #c4c4c4;
    background-clip: padding-box;
  }
`;

export const MilestoneSearchWrapper = styled.div`
  width: 100%;
  ${({ disabled }) => disabled && 'pointer-events: none;'}
`;

export const MilestoneSearchButton = styled(ButtonUnstyled)`
  font-family: 'Space Grotesk';
  font-weight: 500;
  font-size: 13px;
  width: 100%;
  height: 32px;
  border-radius: 4px;
  background: #141414;
  border: 1px solid ${(props) => (props.open ? palette.highlightPurple : `transparent`)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  :hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }
`;

export const MilestoneSearchImageLabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const MilestoneSearchPopper = styled(PopperUnstyled)`
  width: ${({ anchorEl }) => `${anchorEl?.getBoundingClientRect().width}px` ?? 'auto'};
  border-radius: 4px;
  background-color: #1f1f1f;
  border: 1px solid #7a7a7a;
  z-index: 9999;
  position: relative;
  z-index: 9999;
`;

export const MilestoneSearchAutocomplete = styled(Autocomplete)``;

export const MilestoneSearchClickAway = styled(ClickAwayListener)``;

export const MilestoneSearchInputList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MilestoneSearchInput = styled(TextField)`
  && {
    width: 100%;
    padding: 10px;
    && .MuiOutlinedInput-root {
      background: #313131;
      width: 100%;
      display: flex;
      padding: 0 8px;
    }
    && .MuiOutlinedInput-input {
      height: 32px;
      padding: 0;
      font-family: 'Space Grotesk';
      font-weight: 400;
      font-size: 14px;
      color: ${palette.white};
    }
  }
  .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;

export const MilestoneSearchInputAdornment = styled(InputAdornment)`
  && {
    height: 13px;
    width: 13px;
  }
`;

export const MilestoneSearchInputIcon = styled(SearchIcon)`
  path {
    stroke: ${palette.white};
  }
`;

export const MilestoneSearchAutocompletePopper = styled.div`
  && {
    position: relative;
  }
  .MuiAutocomplete-noOptions {
    font-family: 'Space Grotesk';
    color: ${palette.white};
    margin: 0;
    padding: 0;
    background-image: none;
    background: #1f1f1f !important;
    border: none;
    border-radius: 0;
    padding: 12px;
    font-size: 13px;
    font-weight: 500;
  }
`;

export const MilestoneSearchPaper = styled.div`
  && {
    padding: 0;
    margin: 0;
    border-radius: 0 0 4px 4px;
  }
`;

export const MilestoneSearchList = styled.ul`
  && {
    color: ${palette.white};
    margin: 0;
    padding: 0;
    background-image: none;
    background: #1f1f1f !important;
    border: none;
    border-radius: 0;
    overflow-y: auto;
    max-height: 216px;
    ${scrollBarStyles}
  }
`;

export const MilestoneSearchListItem = styled.li`
  && {
    list-style: none;
    height: 36px;
    padding: 6px 12px;
    display: ${({ hide }) => (hide ? 'none' : 'flex')};
    align-items: center;
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 500;
    color: ${palette.white};
    :last-of-type {
      border-radius: 0 0 4px 4px;
    }

    &&[aria-selected='true'],
    &&[aria-selected='true'].Mui-focused,
    &&.Mui-focused {
      background: rgba(122, 122, 122, 0.2);
    }
  }
`;

export const MilestoneSearchDefaultImage = styled((props) => (
  <div {...props}>
    <MilestoneIcon />
  </div>
))`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const MilestoneSearchLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 500;
    color: ${({ hasValue }) => (hasValue ? palette.white : `#5e5e5e`)};
    margin-left: 6px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 35ch;
  }
`;

export const MilestoneSearchLabelPlaceholder = styled(Typography)``;

export const MilestoneSearchButtonCloseIcon = styled(CloseModalIcon)`
  transform: rotate(90deg);
  path {
    fill: #7a7a7a;
  }
`;

export const MilestoneSearchCheckBox = styled((props) => (
  <div {...props}>
    <CheckBox />
  </div>
))`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const MilestoneSearchCheckBoxEmpty = styled((props) => (
  <div {...props}>
    <CheckBoxEmpty />
  </div>
))`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const MilestoneSearchCreateMilestoneButton = styled(ButtonUnstyled)`
  && {
    background: #1f1f1f;
    width: 100%;
    border: none;
    outline: none;
    text-align: left;
    height: 36px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    :hover {
      background: rgba(122, 122, 122, 0.2);
      cursor: pointer;
    }
  }
`;

export const MilestoneSearchCreateMilestoneButtonLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
  }
`;

export const MilestoneSearchCreateMilestoneIcon = styled((props) => (
  <div {...props}>
    <MilestoneCreateIcon />
  </div>
))`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #313131;
  border-radius: 50px;
  svg {
    width: 24px;
    height: 24px;
  }
`;
