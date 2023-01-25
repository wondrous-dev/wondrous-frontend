import styled from 'styled-components';
import palette from 'theme/palette';
import { Button, Typography, Tabs, InputBase } from '@mui/material';
import React from 'react';
import { CreateFormCancelButton, CreateFormMainSelects, CreateFormPreviewButton } from 'components/CreateEntity/styles';
import { BaseCard } from '../card';
import { GradientMidnightDiagonal, GradientMidnightVertical } from '../gradients';

export const PodWrapper = styled.div`
  background: #363636;
  padding: 1px 8px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 16px;
  width: fit-content;
`;

export const PodName = styled(Typography)`
  && {
    font-size: 13px;
    color: ${palette.white};
  }
`;

export const PaymentModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px !important;
`;

export const PaymentModal = styled(BaseCard)`
  width: 780px;
  position: absolute;
  left: 50%;
  top: 50%;
  height: 90%;
  padding: 10px 0;
  transform: translate(-50%, -50%);
  overflow-y: scroll;
  z-index: 2100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(20, 20, 20) !important;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const PodNameTypography = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
    color: ${palette.white};
  }
`;

export const PaymentTitleDiv = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const PaymentTitleText = styled(Typography)`
  && {
    color: ${palette.white};
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 8px;
  }
`;

export const PaymentDescriptionText = styled(Typography)`
  && {
    color: #828282;
    font-weight: 500;
    font-size: 15px;
    line-height: 19px;
    white-space: pre-line;
  }
`;

export const MakeSubmissionDiv = styled.div`
  background: #0f0f0f;
  border-radius: 184px;
  padding: 12px;
  display: flex;
  align-items: center;
`;

export const MakePaymentDiv = styled.div`
  background: #0f0f0f;
  border-radius: 184px;
  padding: 12px;
  display: flex;
  align-items: center;
`;

export const StyledTabs = styled((props) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))({
  '&.MuiTabs-root': {
    marginTop: 30,
    width: '100%',
    margin: '0 auto',
  },
  '& .MuiTabs-flexContainer': {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: 680,
    margin: '0 auto',

    '& a': {
      textDecoration: 'none',
    },
  },
  '& .MuiButtonBase-root': {
    position: 'relative',
    borderBottom: '2px solid #4B4B4B',
    flex: 1,
    // text
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '19px',
    textAlign: 'center',
    color: '#FFFFFF',
    maxWidth: 'none',
  },
  '& .MuiButtonBase-root:first-child': {
    marginRight: '24px',
  },
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    width: '100%',
    backgroundColor: '#7427FF',
  },
  '& .Mui-selected': {
    color: 'white !important',
  },
});

export const PaymentMethodWrapper = styled.div`
  padding-bottom: 32px;
`;

export const WarningTypography = styled(Typography)`
  && {
    font-family: Space Grotesk;
    font-size: 14px;
    color: #ffff;
    margin-top: 16px;
    margin-bottom: -20px;
    font-weight: bolder;
  }
`;

export const PaymentPendingTypography = styled(Typography)`
  && {
    font-family: Space Grotesk;
    color: #ffff;
    font-size: 16px;
  }
`;

export const ChangePaymentButton = styled(Button)`
  && {
    border: 1px solid #4b4b4b;
    border-radius: 4px;
    color: ${palette.white};
    margin-top: 12px;
    font-size: 14px;
  }
`;

export const ChangePaymentAmountDiv = styled(CreateFormMainSelects)`
  && {
    margin-bottom: 0;
    align-items: center;
    justify-content: flex-start;
  }
`;

export const SaveNewRewardAmountButton = styled(CreateFormPreviewButton)`
  && {
    margin-top: 12px;
  }
`;

export const CancelNewRewardAmountButton = styled(CreateFormCancelButton)`
  && {
    margin-left: 8px;
    margin-top: 12px;
  }
`;
