import InputBase from '@mui/material/InputBase';
import { Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';
import DropdownSelect from 'components/Common/DropdownSelect';
import { Button } from '../../button';

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
    color: ${palette.grey20};
  }
`;

export const OfflinePaymentInputLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 12px;
    font-weight: 600;
    color: ${palette.blue20};
    margin-top: 20px;
  }
`;

export const OfflinePaymentWalletWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 12px;
`;

export const OfflinePaymentWallet = styled(InputBase)`
  height: 32px;
  background: ${palette.background.default};
  border-radius: 6px;

  .MuiInputBase-input {
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 400;
    color: ${palette.grey250};
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
    background: ${palette.background.default};
    display: flex;
    align-items: center;
  }
`;

export const OfflinePaymentWalletButtonText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 16px;
    font-weight: 400;
    color: ${palette.grey20};
    margin-right: 8px;
  }
`;

export const OfflinePaymentLinkInput = styled(InputBase)`
  && {
    margin-top: 10px;
    width: 100%;
    height: 32px;
    border-radius: 6px;

    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    color: ${palette.grey250};
    padding: 10px 15px;
    background: ${palette.background.default};
  }
`;

export const OfflinePaymentButtonWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;

export const MediaUploadDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 8px;
  flex-flow: wrap;
  gap: 8px;
`;
