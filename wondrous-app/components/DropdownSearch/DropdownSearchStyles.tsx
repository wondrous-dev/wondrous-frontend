import styled, { css } from 'styled-components';
import { ButtonUnstyled, PopperUnstyled } from '@mui/base';
import { InputAdornment, TextField, Typography } from '@mui/material';

import palette from 'theme/palette';

import ArrowDownIcon from 'components/Icons/arrowDropDown';
import SearchIcon from 'components/Icons/search';
import CheckBoxIcon from 'components/Icons/checkBox.svg';
import CheckBoxEmptyIcon from 'components/Icons/checkBoxEmpty.svg';

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

export const DropdownSearchButton = styled(ButtonUnstyled)`
  font-family: 'Space Grotesk';
  font-weight: 500;
  font-size: 13px;
  width: 100%;
  height: 32px;
  border-radius: 4px;
  background: #141414;
  border: 1px solid ${({ open }) => (open ? `#7a7a7a` : `transparent`)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  :hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }
`;

export const DropdownSearchImageLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: 320px;
`;

export const DropdownSearchLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 500;
    color: ${({ hasValue }) => (hasValue ? palette.white : `#5e5e5e`)};
    margin-left: 6px;
    margin-right: 6px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 35ch;
  }
`;

export const DropdownSearchDownIcon = styled(ArrowDownIcon)`
  transform: rotate(45deg);
  path {
    fill: #7a7a7a;
  }
`;

export const DropdownSearchPopper = styled(PopperUnstyled)`
  width: ${({ anchorEl }) => `${anchorEl?.getBoundingClientRect().width}px` ?? 'auto'};
  border-radius: 4px;
  min-width: fit-content;
  background-color: #1f1f1f;
  border: 1px solid #7a7a7a;
  z-index: 9999;
  position: relative;
  z-index: 9999;
`;

export const DropdownSearchInput = styled(TextField)`
  && {
    width: 100%;
    max-width: 400px;
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
  .MuiChip-root {
    color: ${palette.white};
  }
`;

export const DropdownSearchInputAdornment = styled(InputAdornment)`
  && {
    height: 13px;
    width: 13px;
  }
`;

export const DropdownSearchInputIcon = styled(SearchIcon)`
  path {
    stroke: ${palette.white};
  }
`;

export const DropdownSearchCheckBox = styled((props) => (
  <div {...props}>
    <CheckBoxIcon />
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

export const DropdownSearchCheckBoxEmpty = styled((props) => (
  <div {...props}>
    <CheckBoxEmptyIcon />
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

export const DropdownSearchPaper = styled.div`
  && {
    padding: 0;
    margin: 0;
    border-radius: 0 0 4px 4px;
    width: auto;
  }
`;

export const DropdownSearchList = styled.ul`
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

export const DropdownSearchListItem = styled.li`
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

export const DropdownSearchAutocompletePopper = styled.div`
  && {
    position: relative;
    width: auto !important;
    min-width: fit-content;
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

export const DropdownSearchCreateButton = styled(ButtonUnstyled)`
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
