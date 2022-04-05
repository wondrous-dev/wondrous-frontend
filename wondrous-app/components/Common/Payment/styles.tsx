import styled from 'styled-components';
import { GradientMidnightDiagonal, GradientMidnightVertical } from '../gradients';
import { Grey80, Grey250, White } from '../../../theme/colors';
import { Button, Typography } from '@material-ui/core';
import { BaseCard } from '../card';
import React from 'react';
import { Tabs, InputBase } from '@material-ui/core';
import { CreateFormCancelButton, CreateFormMainSelects, CreateFormPreviewButton } from 'components/CreateEntity/styles';

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
    color: ${White};
  }
`;

export const PaymentModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px !important;
`;

export const PaymentModal = styled(BaseCard)`
  width: 680px;
  position: absolute;
  left: 50%;
  top: 50%;
  height: 70%;
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

export const PodNameTypography = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
    color: ${White};
  }
`;

export const PaymentTitleDiv = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const PaymentTitleTextDiv = styled.div``;

export const PaymentTitleText = styled(Typography)`
  && {
    color: ${White};
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
    //text
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
});

export const PaymentLinkInput = styled(InputBase)`
  && {
    width: 100%;
    height: 40px;
    border: 1px solid #4b4b4b;
    border-radius: 6px;

    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
    padding: 10px 15px;
  }
`;

export const PaymentMethodWrapper = styled.div`
  margin-bottom: 32px;
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
    color: ${White};
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
