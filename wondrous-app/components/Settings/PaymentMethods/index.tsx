import React, { useState, useEffect, useCallback } from 'react';

import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_PAYMENT_METHODS_FOR_ORG } from 'graphql/queries/payment';
import { GET_ORG_BY_ID } from 'graphql/queries';
import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import {
  PaymentMethodDescription,
  PaymentMethodSettingWrapper,
  PaymentMethodDisplayWrapper,
  PaymentMethodSubHeader,
  NewPaymentMethodButton,
} from './styles';
import { PayoutSettingsHeaderIcon } from '../../Icons/PayoutSettingsHeaderIcon';
import PaymentMethodList from './PaymentMethodList';
import ConfigPaymentMethodModal from './ConfigPaymentMethodModal';

function PaymentMethods(props) {
  const { orgId } = props;
  const [showConfigModal, setShowConfigModal] = useState(null);

  const [getPaymentMethods, { data: paymentMethodData }] = useLazyQuery(GET_PAYMENT_METHODS_FOR_ORG);
  useEffect(() => {
    if (orgId) {
      getPaymentMethods({
        variables: {
          orgId,
          includeDeactivated: true,
        },
      });
    }
  }, [orgId, getPaymentMethods]);
  const { data: orgData } = useQuery(GET_ORG_BY_ID, {
    variables: {
      orgId,
    },
  });
  const org = orgData?.getOrgById;

  return (
    <SettingsWrapper>
      <PaymentMethodSettingWrapper>
        <HeaderBlock icon={<PayoutSettingsHeaderIcon />} title="Payment Methods" description="Manage payment methods" />
        <PaymentMethodDisplayWrapper>
          <PaymentMethodSubHeader>Create New</PaymentMethodSubHeader>
          <PaymentMethodDescription>Create new payment method to pay out contributors</PaymentMethodDescription>
          <NewPaymentMethodButton onClick={() => setShowConfigModal(true)}>New Payment Method </NewPaymentMethodButton>
        </PaymentMethodDisplayWrapper>
        <ConfigPaymentMethodModal
          org={org}
          orgId={orgId}
          open={showConfigModal}
          setShowConfigModal={setShowConfigModal}
        />
        <PaymentMethodList paymentMethods={paymentMethodData?.getPaymentMethodsForOrg} />
      </PaymentMethodSettingWrapper>
    </SettingsWrapper>
  );
}

export default PaymentMethods;
