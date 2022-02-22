import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ethers, utils } from 'ethers';
import DropdownSelect from '../DropdownSelect/dropdownSelect';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from '../../../graphql/queries/wallet';
import { LINK_OFF_PLATFORM_PAYMENT } from '../../../graphql/mutations/payment';
import { PaymentLinkInput, WarningTypography } from './styles';
import { CreateFormPreviewButton } from '../../CreateEntity/styles';
import { ErrorText } from '../../Common';
import {
  GET_PAYMENTS_FOR_ORG,
  GET_PAYMENTS_FOR_POD,
  GET_UNPAID_SUBMISSIONS_FOR_ORG,
  GET_UNPAID_SUBMISSIONS_FOR_POD,
} from '../../../graphql/queries/payment';
import { SnackbarAlertContext } from '../SnackbarAlert';
import { Typography } from '@material-ui/core';
import { PaymentDescriptionText } from './styles';
import { White } from '../../../theme/colors';

const OFFLINE_PAYMENT_OPTIONS = [
  { label: 'Block Explorer Link', value: 'manual_explorer_link' },
  { label: 'Utopia labs Link', value: 'utopia_link' },
];
export const OfflinePayment = (props) => {
  const { handleClose, approvedSubmission, fetchedTask, submissionPaymentInfo } = props;
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
            color: White,
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

  return (
    <>
      <DropdownSelect
        value={selectedOfflineType}
        setValue={setSelectedOfflineType}
        labelText="Choose a payment method"
        options={OFFLINE_PAYMENT_OPTIONS}
        onChange={(e) => {}}
        formSelectStyle={{
          marginBottom: '16px',
        }}
      />
      <PaymentLinkInput
        placeholder="Proof of payment link"
        value={offlinePaymentLink}
        onChange={(e) => setOfflinePaymentLink(e.target.value)}
      />
      {linkPaymentError && <ErrorText>error linking payments</ErrorText>}
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        {!submissionPaid && (
          <CreateFormPreviewButton onClick={handleLinkPaymentLinkClick}>Link Payment</CreateFormPreviewButton>
        )}
        {submissionPaid && <PaymentDescriptionText>Paid!</PaymentDescriptionText>}
      </div>
    </>
  );
};
