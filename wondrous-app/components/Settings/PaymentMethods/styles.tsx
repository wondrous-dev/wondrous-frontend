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
import styled from 'styled-components';
import { background, blackColors, blueColors, greyColors, white } from 'theme/colors';
import { BaseCard } from 'components/Common/card';

export const PaymentMethodSettingWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const PaymentMethodSubHeader = styled(InputLabel)`
  && {
    font-family: 'Space Grotesk';
    font-size: 20px;
    font-weight: 500;
    color: ${blueColors.blue20};
    margin-left: 8px;
    margin-top: 28px;
  }
`;

export const PaymentMethodNameHeader = styled(Typography)`
  && {
    color: ${white};
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 15px;
  }
`;

export const PaymentMethodDescription = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 400;
    color: ${greyColors.grey250};
    margin-top: 12px;
  }
`;

export const PaymentMethodFormWrapper = styled(Box)`
  && {
    background: #1b1b1b;
    border-radius: 6px;
    margin-top: 48px;
  }
`;

export const PaymentMethodDisplayWrapper = styled(Box)`
  && {
    background: ${blackColors.black90};
    border-radius: 6px;
    padding: 24px;
    margin-top: 24px;
    :hover {
      background: #474747 !important;
      cursor: pointer;
    }
  }
`;

export const PaymentMethodFormHeader = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 18px;
    font-weight: 700;
    color: ${white};
  }
`;

export const PaymentMethodFormHeaderSecondary = styled(Typography)`
  && {
    color: #c2b2f3;
  }
`;

export const CustomAddressInput = styled(InputBase)`
  && {
    width: 100%;
    height: 40px;
    border: 2px solid #4b4b4b;
    border-radius: 6px;
    margin-top: 16px;
    margin-right: 16px;
    font-size: 16px;
    font-color: ${white};
    line-height: 21px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
    padding: 10px 15px;
  }
`;

export const AddPaymetMethodButton = styled(Button)`
  && {
    width: 100%;
    margin-top: 28px;
    background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
    button {
      background: ${background};
      font-family: 'Space Grotesk';
      font-size: 16px;
      font-weight: 500;
    }
  }
`;

export const NewPaymentMethodButton = styled(Button)`
  && {
    width: 200px;
    margin-top: 20px;
    background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
    button {
      background: ${background};
      font-family: 'Space Grotesk';
      font-size: 16px;
      font-weight: 500;
    }
  }
`;

export const PaymentConfigModal = styled(BaseCard)`
  && {
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
  }
`;

export const PaymentMethodActionMenu = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: flex-end;
  height: 24px;
`;
