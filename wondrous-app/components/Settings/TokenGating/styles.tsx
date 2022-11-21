import { PopperUnstyled } from '@mui/base';
import { Box, ButtonBase, InputBase, List, ListItem, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import ArrowDropDownIcon from 'components/Icons/arrowDropDown';
import styled from 'styled-components';
import palette from 'theme/palette';

export const TokenGatingFormHeaderSecondary = styled(Typography)`
  && {
    color: #c2b2f3;
  }
`;

export const TokenGatingAutocompleteTextfieldWrapper = styled(Box)`
  && {
    display: flex;
    align-items: center;
  }
`;

export const TokenGatingTextfieldInput = styled(InputBase)`
  && {
    background: ${palette.background.default};
    border-radius: 6px;
    border: 1px solid ${palette.grey85};
    display: flex;
    color: ${palette.grey250};
    height: inherit;
    font-size: 15px;
    height: 40px;
  }

  .MuiInputBase-input {
    padding: 0;
    padding-left: 8px;
  }
`;

export const TokenGatingTextfieldButton = styled(ButtonBase)`
  && {
    background: ${palette.black92};
    height: 100%;
    width: 34px;
    margin-top: 0px;
  }
`;

export const TokenGatingAutocompleteTextfieldButton = styled(TokenGatingTextfieldButton)`
  && {
    border-radius: 0 5px 5px 0;
    border-left: 1px solid ${palette.grey85};
  }
`;

export const TokenGatingTextfieldButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  align-items: center;
`;

export const TokenGatingTextfieldButtonUp = styled(TokenGatingTextfieldButton)`
  && {
    transform: rotate(180deg);
    border-radius: 0 0 0 6px;
    border-top: 1px solid ${palette.grey85};
    border-right: 1px solid ${palette.grey85};
  }
`;

export const TokenGatingTextfieldButtonDown = styled(TokenGatingTextfieldButton)`
  && {
    border-radius: 0 0 6px 0;
    border-top: 1px solid ${palette.grey85};
    border-left: 1px solid ${palette.grey85};
  }
`;

export const TokenGatingAutocompleteTextfieldDownIcon = styled(ArrowDropDownIcon)``;

export const TokenGatingAutocompletePopper = styled(PopperUnstyled)`
  && {
    border-radius: 6px;
    border: 1px solid #9b9b9b;
    .MuiAutocomplete-noOptions {
      font-family: var(--font-space-grotesk);
      font-size: 14px;
      font-weight: 400;
      background: ${palette.grey100};
      color: ${palette.white};
      height: 50px;
    }
  }
`;

export const TokenGatingAutocompleteList = styled(List)`
  && {
    overflow-y: auto;
    margin: 0;
    padding: 0;
    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-track {
      background: ${palette.grey90};
    }
    ::-webkit-scrollbar-thumb {
      background: ${palette.grey57};
      border-radius: 50px;
    }
  }
`;

export const TokenGatingAutocompleteListItem = styled(ListItem)`
  && {
    background: ${palette.grey100} !important; // There's a global background with '!important', so we need to override it
    height: 50px;
    font-family: var(--font-space-grotesk);
    font-size: 14px;
    font-weight: 400;
    color: ${palette.white};
    :hover {
      background: #474747 !important;
      cursor: pointer;
    }
    svg {
      margin-right: 8px;
    }
  }
`;

export const TokenGatingInputImage = styled((props) => (
  <SafeImage
    {...props}
    useNextImage={false}
    style={{
      width: '24px',
      marginRight: '8px',
    }}
  />
))``;
