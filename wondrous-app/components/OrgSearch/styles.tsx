import styled from 'styled-components';
import { ButtonUnstyled } from '@mui/base';
import typography from 'theme/typography';
import palette from 'theme/palette';
import TextField from '@mui/material/TextField';
import SearchIcon from 'components/Icons/search';

export const OrgSearchButton = styled(ButtonUnstyled)`
  font-family: ${typography.fontFamily};
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  color: ${palette.white};
  border-radius: 4px;
  border: 0;
  background: ${palette.midnight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  gap: 8px;
  min-height: 54px;
  width: 100%;
  cursor: pointer;
`;

export const OrgSearchWrapper = styled.div`
  width: 100%;
`;

export const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
  overflow: hidden;
  gap: 8px;
`;

export const OrgSearchInput = styled(TextField)`
  && {
    width: 100%;
    padding: 10px;
    && .MuiOutlinedInput-root {
      background: ${palette.midnight};
      width: 100%;
      display: flex;
      padding: 0 8px;
    }
    && .MuiOutlinedInput-input {
      height: 32px;
      padding: 0;
      font-family: ${typography.fontFamily};
      font-weight: 400;
      font-size: 14px;
      color: ${palette.white};
    }
  }
  .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;
export const OrgSearchListItem = styled.li`
  && {
    list-style: none;
    height: 34px;
    padding: 6px 12px;
    background: ${palette.black92};
    display: ${({ hide }) => (hide ? 'none' : 'flex')};
    align-items: center;
    font-family: ${typography.fontFamily};
    font-size: 14px;
    gap: 8px;
    font-weight: 400;
    padding-left: 8px;
    border-radius: 4px;
    color: ${palette.white};
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 5px;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 1px;
      pointer-events: none;
    }

    &:hover {
      background: ${palette.black97};
      &::before {
        background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
      }
    }
  }
`;

export const OrgSearchList = styled.ul`
  && {
    color: ${palette.white};
    margin: 0;
    padding: 12px;
    background-image: none;
    border: none;
    border-radius: 0;
    max-height: 170px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

export const OrgSearchInputIcon = styled(SearchIcon)`
  path {
    stroke: ${palette.highlightBlue};
  }
`;
