import React, { useCallback, useEffect, useState } from 'react';
import { ethers, utils } from 'ethers';
import DropdownSelect from '../DropdownSelect/dropdownSelect';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from '../../../graphql/queries/wallet';
import { LINK_OFF_PLATFORM_PAYMENT } from '../../../graphql/mutations/payment';
import { PaymentLinkInput, WarningTypography } from './styles';
import { CreateFormPreviewButton } from '../../CreateEntity/styles';
import { ErrorText } from '../../Common';

const OFFLINE_PAYMENT_OPTIONS = [
  { label: 'Block Explorer Link', value: 'manual_explorer_link' },
  { label: 'Utopia labs Link', value: 'utopia_link' },
];
export const OfflinePayment = (props) => {
  const { setShowPaymentModal, approvedSubmission, fetchedTask, submissionPaymentInfo } = props;
  const [selectedOfflineType, setSelectedOfflineType] = useState(null);
  const [offlinePaymentLink, setOfflinePaymentLink] = useState(null);
  const [linkPaymentError, setLinkPaymentError] = useState(null);
  const handleLinkPaymentLinkClick = () => {
    setLinkPaymentError(null)
    const offlineLinks = [{
      type: selectedOfflineType,
      link: offlinePaymentLink
    }]
    linkOffPlatformPayment({
      variables: {
        input: {
          submissionId: approvedSubmission.id,
          offlineLinks
        },
      },
    });
};
  const [linkOffPlatformPayment] = useMutation(LINK_OFF_PLATFORM_PAYMENT, {
    onCompleted: (data) => {
      console.log(data)
    },
    onError: (e) => {
      console.error(e);
      setLinkPaymentError(e)
    },
  });

  return (
    <>
      <DropdownSelect
        value={selectedOfflineType}
        setValue={setSelectedOfflineType}
        labelText="choose a payment method"
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
        <CreateFormPreviewButton onClick={handleLinkPaymentLinkClick}>Link Payment</CreateFormPreviewButton>
      </div>
    </>
  );
};
