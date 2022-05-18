import InputBase from '@material-ui/core/InputBase';
import { Typography } from '@mui/material';
import styled from 'styled-components';
import { Background, Blue20, Grey20, Grey250 } from 'theme/colors';
import { Button } from '../../button';
import DropdownSelect from '../../DropdownSelect/dropdownSelect';

export const OfflinePaymentWrapper = styled.div`
  margin-top: 10px;
`;

export const OfflinePaymentDropdownWrapper = styled.div`
  height: 70px;
  width: 100%;
  margin-top: -10px;
  & > div {
    height: 0;
    width: 100%;
    max-width: 100%;
    margin-top: 0;
  }
`;

export const OfflinePaymentDropdown = styled(DropdownSelect)``;

export const OfflinePaymentDescriptionText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    color: #828282;
    font-weight: 500;
    font-size: 15px;
    line-height: 19px;
    white-space: pre-line;
  }
`;

export const OfflinePaymentWarningTypography = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 12px;
    color: ${Grey20};
  }
`;

export const OfflinePaymentInputLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 500;
    color: ${Blue20};
    margin-top: 20px;
  }
`;

export const OfflinePaymentWalletWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

export const OfflinePaymentWallet = styled(InputBase)`
  width: 165px;
  height: 40px;
  background: ${Background};
  border-radius: 6px;

  .MuiInputBase-input {
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 400;
    color: ${Grey250};
    padding: 10px 12px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const OfflinePaymentWalletButton = styled(Button)`
  && {
    min-height: 40px;
    height: 40px;
    margin-left: 12px;
  }
  & > button {
    background: ${Background};
    display: flex;
    align-items: center;
  }
`;

export const OfflinePaymentWalletButtonText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 16px;
    font-weight: 400;
    color: ${Grey20};
    margin-right: 8px;
  }
`;

export const OfflinePaymentLinkInput = styled(InputBase)`
  && {
    margin-top: 10px;
    width: 100%;
    height: 40px;
    border-radius: 6px;

    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    color: ${Grey250};
    padding: 10px 15px;
    background: ${Background};
  }
`;

export const OfflinePaymentButtonWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;
