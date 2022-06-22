import { useMutation } from '@apollo/client';
import { Typography } from '@mui/material';
import CopyIcon from 'components/Icons/copy';
import { LINK_OFF_PLATFORM_PAYMENT } from 'graphql/mutations/payment';
import {
  GET_PAYMENTS_FOR_ORG,
  GET_PAYMENTS_FOR_POD,
  GET_UNPAID_SUBMISSIONS_FOR_ORG,
  GET_UNPAID_SUBMISSIONS_FOR_POD,
} from 'graphql/queries/payment';
import React, { useContext, useState } from 'react';
import { ErrorText } from '../..';
import palette from 'theme/palette';
import { CreateFormPreviewButton } from '../../../CreateEntity/styles';
import { SnackbarAlertContext } from '../../SnackbarAlert';
import {
  OfflinePaymentButtonWrapper,
  OfflinePaymentDescriptionText,
  OfflinePaymentDropdown,
  OfflinePaymentDropdownWrapper,
  OfflinePaymentInputLabel,
  OfflinePaymentLinkInput,
  OfflinePaymentWallet,
  OfflinePaymentWalletButton,
  OfflinePaymentWalletButtonText,
  OfflinePaymentWalletWrapper,
  OfflinePaymentWarningTypography,
  OfflinePaymentWrapper,
} from './styles';

const OFFLINE_PAYMENT_OPTIONS = [
  { label: 'Block Explorer Link', value: 'manual_explorer_link' },
  { label: 'Utopia labs Link', value: 'utopia_link' },
];
export const OfflinePayment = (props) => {
  const { handleClose, approvedSubmission, fetchedTask, submissionPaymentInfo } = props;
  const recipientAddress = submissionPaymentInfo?.paymentData?.[0]?.recepientAddress;
  const [selectedOfflineType, setSelectedOfflineType] = useState(null);
  const [offlinePaymentLink, setOfflinePaymentLink] = useState(null);
  const [linkPaymentError, setLinkPaymentError] = useState(null);
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const [submissionPaid, setSubmissionPaid] = useState(null);
  const handleLinkPaymentLinkClick = () => {
    setLinkPaymentError(null);
    const offlineLinks = [
      {
        type: selectedOfflineType,
        link: offlinePaymentLink,
      },
    ];
    linkOffPlatformPayment({
      variables: {
        input: {
          submissionId: approvedSubmission.id,
          offlineLinks,
        },
        refetchQueries: [
          GET_UNPAID_SUBMISSIONS_FOR_POD,
          GET_UNPAID_SUBMISSIONS_FOR_ORG,
          GET_PAYMENTS_FOR_POD,
          GET_PAYMENTS_FOR_ORG,
        ],
      },
    });
    if (handleClose) {
      handleClose();
    }
    setSnackbarAlertOpen(true);
    setSnackbarAlertMessage(
      <>
        <Typography
          variant="body1"
          style={{
            color: palette.white,
          }}
        >
          Payment linked
        </Typography>
      </>
    );
  };
  const [linkOffPlatformPayment] = useMutation(LINK_OFF_PLATFORM_PAYMENT, {
    onCompleted: (data) => {
      setSubmissionPaid(true);
    },
    onError: (e) => {
      console.error(e);
      setLinkPaymentError(e);
    },
  });
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${recipientAddress}`);
    setSnackbarAlertOpen(true);
    setSnackbarAlertMessage('Address copied to clipboard');
  };

  return (
    <OfflinePaymentWrapper>
      <OfflinePaymentWarningTypography>
        This link will only be visible to the assignee and other admins with the payment permission.
      </OfflinePaymentWarningTypography>
      <OfflinePaymentInputLabel>Platform</OfflinePaymentInputLabel>
      <OfflinePaymentDropdownWrapper>
        <OfflinePaymentDropdown
          value={selectedOfflineType}
          setValue={setSelectedOfflineType}
          labelText="Choose a payment method"
          options={OFFLINE_PAYMENT_OPTIONS}
          onChange={(e) => {}}
        />
      </OfflinePaymentDropdownWrapper>
      <OfflinePaymentInputLabel>User Wallet</OfflinePaymentInputLabel>
      <OfflinePaymentWalletWrapper>
        <OfflinePaymentWallet disabled value={recipientAddress} />
        <OfflinePaymentWalletButton highlighted onClick={handleCopyAddress}>
          <OfflinePaymentWalletButtonText>Copy Address</OfflinePaymentWalletButtonText>
          <CopyIcon />
        </OfflinePaymentWalletButton>
      </OfflinePaymentWalletWrapper>
      <OfflinePaymentInputLabel>Link</OfflinePaymentInputLabel>
      <OfflinePaymentLinkInput
        placeholder="Proof of payment link"
        value={offlinePaymentLink}
        onChange={(e) => setOfflinePaymentLink(e.target.value)}
      />
      {linkPaymentError && <ErrorText>error linking payments</ErrorText>}
      <OfflinePaymentButtonWrapper>
        {!submissionPaid && (
          <CreateFormPreviewButton onClick={handleLinkPaymentLinkClick}>Link Payment</CreateFormPreviewButton>
        )}
        {submissionPaid && <OfflinePaymentDescriptionText>Paid!</OfflinePaymentDescriptionText>}
      </OfflinePaymentButtonWrapper>
    </OfflinePaymentWrapper>
  );
};
