import { Box, InputBase, InputLabel, Typography } from '@mui/material';
import styled from 'styled-components';

import { Button } from 'components/Common/button';
import { SafeImage } from 'components/Common/Image';
import { BaseCard } from 'components/Common/card';

import typography from 'theme/typography';
import palette from 'theme/palette';

export const PaymentMethodSettingWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const PaymentMethodSubHeader = styled(InputLabel)`
  && {
    font-family: 'Space Grotesk';
    font-size: 20px;
    font-weight: 500;
    color: ${palette.blue20};
    margin-left: 8px;
    margin-top: 28px;
  }
`;

export const PaymentMethodNameHeader = styled(Typography)`
  && {
    color: ${palette.white};
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
    color: ${palette.grey250};
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

export const NewPaymentMethodCTAWrapper = styled.div`
  width: 780px;
  max-width: 780px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${palette.grey900};
  padding: 14px;
  border-radius: 6px;
  margin-top: 46px;
`;

export const NewPaymentMethodCTAButton = styled(Button)`
  && {
    background: linear-gradient(
        270deg,
        ${palette.highlightBlue} -5.62%,
        ${palette.highlightPurple} 45.92%,
        ${palette.blue20} 103.12%
      ),
      linear-gradient(0deg, ${palette.background.default}, ${palette.background.default});

    button {
      display: flex;
      align-items: center;
      gap: 8px;
      background: ${palette.background.default};
      font-family: ${typography.fontFamily};
      font-size: 15px;
      padding: 5.21px 16px 5.21px 5px;
      transition: background 0.2s ease-in-out;
      svg,
      svg circle {
        fill: ${palette.grey900};
      }

      :hover {
        background: transparent;
      }
    }
  }
`;

export const PaymentMethodEmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 337px;
  width: 100%;
  border: 1px solid ${palette.grey99};
  border-radius: 6px;
  margin-top: 32px;
`;

export const PaymentMethodDisplayWrapper = styled.div`
  background: ${palette.black101};
  padding: 12px;
  border-radius: 6px;
  margin: 23px 0;
  width: 100%;
`;

export const PaymentMethodTokenDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${palette.black87};
`;

export const PaymentMethodTokenDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 27px;
  filter: ${({ isDisabled }) => (isDisabled ? 'blur(1.5px)' : 'none')};
`;

export const PaymentMethodTokenMetadataWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 10px;
  filter: ${({ isDisabled }) => (isDisabled ? 'blur(1.5px)' : 'none')};
`;

export const PaymentMethodTokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  filter: ${({ isDisabled }) => (isDisabled ? 'blur(1.5px)' : 'none')};
`;

export const PaymentMethodTokenInfoLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 12px;
    line-height: 12px;
    color: ${palette.grey250};
  }
`;

export const PaymentMethodTokenInfoValue = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 7px 5px;
  border-radius: 6px;
  background: ${palette.black97};

  img {
    width: 14px !important;
    height: 14px !important;
  }
`;

export const PaymentMethodTokenInfoValueText = styled(PaymentMethodTokenInfoLabel)`
  && {
    font-weight: 500;
    color: ${palette.white};
    text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : 'capitalize')};
  }
`;

export const PaymentMethodFormHeader = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 18px;
    font-weight: 700;
    color: ${palette.white};
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
    font-color: ${palette.white};
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
      background: ${palette.background.default};
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

export function TokenLogoDisplay(props) {
  return (
    <SafeImage
      useNextImage={false}
      src={props?.src}
      style={{
        width: '29px',
        height: '28px',
        borderRadius: '4px',
        marginRight: '5px',
      }}
    />
  );
}

export const HelpText = styled.a`
  text-decoration: none;
  color: ${palette.highlightBlue};
  font-size: 13px;
  font-weight: 600;
`;
