import React, { useCallback, useEffect, useState } from 'react';
import { ethers, utils } from 'ethers';
import DropdownSelect from '../DropdownSelect/dropdownSelect';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from '../../../graphql/queries/wallet';
import { PROPOSE_GNOSIS_TX_FOR_SUBMISSION } from '../../../graphql/mutations/payment';
import { PaymentLinkInput } from './styles';
import { CreateFormPreviewButton } from '../../CreateEntity/styles';

const OFFLINE_PAYMENT_OPTIONS = [
  { label: 'Block Eplorer Link', value: 'manual_explorer_link' },
  { label: 'Utopia labs Link', value: 'utopia_link' },
];
export const OfflinePayment = (props) => {
  const [selectedOfflineType, setSelectedOfflineType] = useState(null);
  const [offlinePaymentLink, setOfflinePaymentLink] = useState(null);
  const handleLinkPaymentLinkClick = () => {};
  return (
    <>
      <DropdownSelect
        title="offline payment"
        value={selectedOfflineType}
        setValue={setSelectedOfflineType}
        labelText="choose a payment method"
        options={OFFLINE_PAYMENT_OPTIONS}
        onChange={(e) => {}}
      />
      <PaymentLinkInput
        placeHolder="prove of payment link"
        value={offlinePaymentLink}
        onChange={(e) => setOfflinePaymentLink(e.target.value)}
      />
      <CreateFormPreviewButton onClick={handleLinkPaymentLinkClick}>Link Payment</CreateFormPreviewButton>
    </>
  );
};
