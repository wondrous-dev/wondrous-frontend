import React, { useState, useEffect, useCallback } from 'react';

import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_PAYMENT_METHODS_FOR_ORG } from 'graphql/queries/payment';
import { GET_ORG_BY_ID } from 'graphql/queries';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { HeaderBlock } from 'components/Settings/headerBlock';
import CreateBtnIcon from 'components/Icons/createBtn';
import { PaymentMethodSettingWrapper, NewPaymentMethodCTAWrapper, NewPaymentMethodCTAButton } from './styles';
import { PayoutSettingsHeaderIcon } from '../../Icons/PayoutSettingsHeaderIcon';
import PaymentMethodList from './PaymentMethodList';
import ConfigPaymentMethodModal from './ConfigPaymentMethodModal';

function PaymentMethods(props) {
  const { orgId } = props;
  const [showConfigModal, setShowConfigModal] = useState(null);

  const [getPaymentMethods, { data: paymentMethodData }] = useLazyQuery(GET_PAYMENT_METHODS_FOR_ORG);
  const [getOrgById, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);
  useEffect(() => {
    if (orgId) {
      getPaymentMethods({
        variables: {
          orgId,
          includeDeactivated: true,
        },
      });
      getOrgById({
        variables: {
          orgId,
        },
      });
    }
  }, [orgId, getPaymentMethods]);

  const org = orgData?.getOrgById;

  return (
    <SettingsWrapper>
      <PaymentMethodSettingWrapper>
        <HeaderBlock
          icon={<PayoutSettingsHeaderIcon />}
          title="Payment Methods"
          description="Manage and set up your payment methods for paying on your community."
        />

        <NewPaymentMethodCTAWrapper>
          <NewPaymentMethodCTAButton onClick={() => setShowConfigModal(true)}>
            <CreateBtnIcon />
            New Payment Method
          </NewPaymentMethodCTAButton>
        </NewPaymentMethodCTAWrapper>

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
