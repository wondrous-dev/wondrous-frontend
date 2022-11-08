import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

import { GET_PAYMENT_METHODS_FOR_ORG } from 'graphql/queries/payment';
import { GET_ORG_BY_ID } from 'graphql/queries';

import SettingsWrapper from 'components/Common/SidebarSettings';
import HeaderBlock from 'components/Settings/headerBlock';
import CreateBtnIcon from 'components/Icons/createBtn';
import { PayoutSettingsHeaderIcon } from 'components/Icons/PayoutSettingsHeaderIcon';
import PaymentMethodList from './PaymentMethodList';
import ConfigPaymentMethodModal from './ConfigPaymentMethodModal';
import { PaymentMethodSettingWrapper, NewPaymentMethodCTAWrapper, NewPaymentMethodCTAButton } from './styles';

function PaymentMethods(props) {
  const { orgId } = props;
  const [showConfigModal, setShowConfigModal] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);

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

  useEffect(() => {
    if (paymentMethodData?.getPaymentMethodsForOrg?.length) {
      const data = paymentMethodData?.getPaymentMethodsForOrg
        .slice()
        .sort((a, b) => new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime());
      setPaymentMethods(data);
    }
  }, [paymentMethodData?.getPaymentMethodsForOrg]);

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
        <PaymentMethodList paymentMethods={paymentMethods} />
      </PaymentMethodSettingWrapper>
    </SettingsWrapper>
  );
}

export default PaymentMethods;
