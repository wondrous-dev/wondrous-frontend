import { ButtonUnstyled, PopperUnstyled } from '@mui/base';
import { Autocomplete, ClickAwayListener, InputAdornment, TextField, Typography } from '@mui/material';
import CloseModalIcon from 'components/Icons/closeModal';
import PodIcon from 'components/Icons/podIcon';
import SearchIcon from 'components/Icons/search';
import styled, { css } from 'styled-components';
import palette from 'theme/palette';
import Arrow from '../../../Icons/arrow.svg';

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

export const PodSearchWrapper = styled.div``;

export const PodSearchButton = styled(ButtonUnstyled)`
  font-family: 'Space Grotesk';
  font-weight: 500;
  font-size: 13px;
  min-width: 130px;
  max-width: 250px;
  height: 32px;
  border-radius: 4px;
  background: #1f1f1f;
  border: 1px solid ${(props) => (props.open ? `#7a7a7a` : `transparent`)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  gap: 6px;
  :hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    min-width: fit-content;
  }
`;

export const PodSearchImageLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
  overflow: hidden;
`;

export const PodSearchPopper = styled(PopperUnstyled)`
  width: 250px;
  border-radius: 4px;
  background-color: #1f1f1f;
  border: 1px solid #7a7a7a;
  position: relative;
  z-index: 9999;
`;

export const PodSearchAutocomplete = styled(Autocomplete)``;

export const PodSearchClickAway = styled(ClickAwayListener)``;

export const PopperSearchInputList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PodSearchInput = styled(TextField)`
  && {
    width: 100%;
    padding: 10px;
    && .MuiOutlinedInput-root {
      background: #0f0f0f;
      width: 100%;
      border-radius: 6px;
      display: flex;
      padding: 0 8px;
    }
    && .MuiOutlinedInput-input {
      height: 36px;
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

export const PodSearchInputAdornment = styled(InputAdornment)`
  && {
    height: 13px;
    width: 13px;
  }
`;

export const PodSearchInputIcon = styled(SearchIcon)`
  path {
    stroke: ${palette.white};
  }
`;

export const PodSearchAutocompletePopper = styled.div`
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

export const PodSearchPaper = styled.div`
  && {
    padding: 0;
    margin: 0;
    border-radius: 0 0 4px 4px;
  }
`;

export const PodSearchList = styled.ul`
  && {
    color: ${palette.white};
    margin: 0;
    padding: 0;
    background-image: none;
    background: #1f1f1f !important;
    border: none;
    border-radius: 0;
    max-height: 170px;
    ${scrollBarStyles}
  }
`;

export const PodSearchListItem = styled.li`
  && {
    list-style: none;
    height: 34px;
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
    &:hover {
      background: ${palette.black81} !important;
    }
    color: ${({ isActive }) => (isActive ? palette.blue20 : palette.white)};
  }
`;

export const PodSearchDefaultImage = styled((props) => (
  <div {...props}>
    <PodIcon />
  </div>
))`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ color }) => color};
  border-radius: 50px;
  width: 20px;
  height: 20px;
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const PodSearchLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 900;
    color: inherit;
    margin-left: 6px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
  }
`;

export const PodSearchButtonArrowIcon = styled((props) => (
  <div {...props}>
    <Arrow />
  </div>
))`
  display: flex;
  align-items: center;
  justify-content: space-between;
  transform: rotate(90deg);
  svg {
    path {
      fill: #7a7a7a;
    }
  }
`;

export const PodSearchButtonDeleteIcon = styled(CloseModalIcon)``;
