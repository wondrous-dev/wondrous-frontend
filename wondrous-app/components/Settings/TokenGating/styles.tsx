import { PopperUnstyled } from '@mui/base';
import {
  Autocomplete,
  Box,
  ButtonBase,
  FormHelperText,
  InputBase,
  InputLabel,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { Button } from 'components/Common/button';
import { SafeImage } from 'components/Common/Image';
import ArrowDropDownIcon from 'components/Icons/arrowDropDown';
import styled from 'styled-components';
import { Background, Black92, Blue20, Grey100, Grey250, Grey57, Grey85, Grey90, White } from 'theme/colors';
import { BaseCard } from 'components/Common/card';

export const TokenGatingWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const TokenGatingHeader = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 28px;
    font-weight: 500;
    color: ${White};
  }
`;

export const TokenGatingSubHeader = styled(InputLabel)`
  font-family: 'Space Grotesk';
  font-size: 20px;
  font-weight: 500;
  color: ${Blue20};
  margin-left: 8px;
  margin-top: 28px;
`;

export const TokenGatingNameHeader = styled(Typography)`
  && {
    color: ${White};
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 15px;
  }
`;

export const TokenGatingDescription = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 400;
    color: ${Grey250};
    margin-top: 12px;
  }
`;

export const TokenGatingFormWrapper = styled(Box)`
  background: #1b1b1b;
  border-radius: 6px;
  margin-top: 48px;
`;

export const TokenGatingElementWrapper = styled(Box)`
  background: #1b1b1b;
  border-radius: 6px;
  padding: 24px;
  margin-top: 24px;
`;

export const TokenGatingFormHeader = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 18px;
    font-weight: 700;
    color: ${White};
  }
`;

export const TokenGatingFormHeaderSecondary = styled(Typography)`
  && {
    color: #c2b2f3;
  }
`;

export const TokenGatingAutocompleteLabel = styled(InputLabel)`
  font-family: 'Space Grotesk';
  font-size: 14px;
  font-weight: 500;
  color: ${Blue20};
  margin-left: 8px;
  margin-top: 28px;
`;

export const TokenGatingAutocomplete = styled(Autocomplete)`
  margin-top: 12px;
`;

export const TokenGatingAutocompleteTextfieldWrapper = styled(Box)`
  && {
    display: flex;
    align-items: center;
  }
`;

export const TokenGatingTextfieldInputWrapper = styled.div`
  margin-top: 12px;
`;

export const TokenGatingTextfieldTextHelperWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
  visibility: ${({ visibility }) => (visibility ? 'visible' : 'hidden')};
`;

export const TokenGatingTextfieldTextHelper = styled(FormHelperText)`
  font-family: 'Space Grotesk';
  font-size: 12px;
  font-weight: 400;
  color: #f93701;
`;

export const TokenGatingTextfieldInput = styled(InputBase)`
  && {
    background: ${Background};
    border-radius: 6px;
    border: 1px solid ${Grey85};
    display: flex;
    color: ${Grey250};
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
    background: ${Black92};
    height: 100%;
    width: 34px;
    margin-top: 0px;
  }
`;

export const TokenGatingAutocompleteTextfieldButton = styled(TokenGatingTextfieldButton)`
  && {
    border-radius: 0 5px 5px 0;
    border-left: 1px solid ${Grey85};
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
    border-top: 1px solid ${Grey85};
    border-right: 1px solid ${Grey85};
  }
`;

export const TokenGatingTextfieldButtonDown = styled(TokenGatingTextfieldButton)`
  && {
    border-radius: 0 0 6px 0;
    border-top: 1px solid ${Grey85};
    border-left: 1px solid ${Grey85};
  }
`;

export const TokenGatingAutocompleteTextfieldDownIcon = styled(ArrowDropDownIcon)``;

export const TokenGatingAutocompletePopper = styled(PopperUnstyled)`
  && {
    border-radius: 6px;
    border: 1px solid #9b9b9b;
    .MuiAutocomplete-noOptions {
      font-family: 'Space Grotesk';
      font-size: 14px;
      font-weight: 400;
      background: ${Grey100};
      color: ${White};
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
      background: ${Grey90};
    }
    ::-webkit-scrollbar-thumb {
      background: ${Grey57};
      border-radius: 50px;
    }
  }
`;

export const TokenGatingAutocompleteListItem = styled(ListItem)`
  && {
    background: ${Grey100} !important; // There's a global background with '!important', so we need to override it
    height: 50px;
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 400;
    color: ${White};
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
    style={{
      width: '24px',
      marginRight: '8px',
    }}
  />
))``;

export const TokenGatingInputWrapper = styled.div``;

export const TokenGatingTokenAmountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TokenGatingButton = styled(Button)`
  width: 100%;
  margin-top: 28px;
  background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
  button {
    background: ${Background};
    font-family: 'Space Grotesk';
    font-size: 16px;
    font-weight: 500;
  }
`;

export const TokenGatingDisabledButton = styled(Button)`
  width: 100%;
  margin-top: 28px;
  background: ${Grey100};
  button {
    background: ${Background};
    font-family: 'Space Grotesk';
    font-size: 16px;
    font-weight: 500;
  }
`;

export const NewTokenGatingButton = styled(Button)`
  width: 200px;
  margin-top: 20px;
  background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
  button {
    background: ${Background};
    font-family: 'Space Grotesk';
    font-size: 16px;
    font-weight: 500;
  }
`;

export const TableValueText = styled(Typography)`
  && {
    color: #c4c4c4;
    font-size: 14px;
    font-height: 22px;
  }
`;

export const TokenGatingConfigModal = styled(BaseCard)`
  width: 680px;
  position: absolute;
  left: 50%;
  top: 50%;
  height: 90%;
  transform: translate(-50%, -50%);
  overflow-y: scroll;
  z-index: 2100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(20, 20, 20) !important;
  padding-bottom: 32px;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const TokenGateActionMenu = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: flex-end;
  height: 24px;
`;

export const TokenGateListDiv = styled.div`
  align-items: center;
  display: flex;
  margin-top: 16px;
`;

export const TokenGateListItemDiv = styled.div`
  align-items: center;
  display: flex;
  margin-right: 16px;
`;

export const TokenGatingHeaderLabel = styled(TokenGatingNameHeader)`
  && {
    color: ${Grey250};
    margin-right: 8px;
  }
`;
